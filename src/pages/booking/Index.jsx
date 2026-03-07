import { useMemo, useState } from "react";
import Table from "../../components/Table";
import {  AlertTriangle, PlusCircle, Pencil, Trash, Eye, Link} from '@boxicons/react';
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import ReactHookForm, { FieldLabel, InputField, SelectionField } from "../../components/ReactHookForm";
import { bookingSchema, deleteSchema, propertySchema } from "../../schema/Schema";
import modalType from "../../constant/ModalType";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../../axiosClient";
import endpoints from "../../endpoints";
import useMutationManager from "../../hooks/useMutationManager";
import bookingStatus from "../../constant/BookingStatus";
import GroupButton from "../../components/GroupButton";

export default function Index(){

    const [query, setQuery] = useState({
        page: 1,
        perPage: 10,
        filter: {
            status: 'pending'
        }
    });

    const [selectedProperty, setSelectedProperty] = useState(null);

    const [modalState, setModalState] = useState({
        isOpen: false,
        selected: null,
        type: modalType.none
    });

    const { mutate: bookingMutation } = useMutationManager({ 
        mutationFn: (data) => axiosClient.post(endpoints.bookings, data),
        invalidateQueryKeys: ['bookingsData'],
    })

    const { mutate: patchBookingMutation } = useMutationManager({ 
        mutationFn: (data) => axiosClient.patch(`${endpoints.bookings}/${data?.id}`, data),
        invalidateQueryKeys: ['bookingsData'],
    })

    const handleOnCloseModalState = ()=>{
        setModalState({
            isOpen: false,
            selected: null,
            type: modalType.none
         })
    }

    const fetchProperties = (params)=>{
        return axiosClient
            .get(endpoints.properties, {params})
            .then(res => res.data);
    }

    const fetchRooms = (params)=>{
        return axiosClient
            .get(endpoints.rooms, {params})
            .then(res => res.data);
    }

    const fetchBookings = (params)=>{
        return axiosClient
            .get(endpoints.bookings, {params})
            .then(res => res.data);
    }

    
    const handleOnSubmitBooking = (formData)=>{
        bookingMutation({...formData});
        handleOnCloseModalState();
    }

    const handleOnPatchBooking = (formData)=>{
        patchBookingMutation({...formData, id: modalState?.selected?.bookings?.id});
        handleOnCloseModalState();
    }

    const { data: bookings } = useQuery({
        queryKey: ['bookingsData', query],
        queryFn: () => fetchBookings({...query})
    })

    const { data: properties } = useQuery({
        queryKey: ['propertiesData'],
        queryFn: () => fetchProperties()
    })

    const { data: rooms } = useQuery({
        queryKey: ['roomsData', selectedProperty],
        queryFn: () => fetchRooms({propertyId: selectedProperty}),
        enabled:  selectedProperty != null
    })

    const defaultCreationValue =  useMemo(()=> ({roomId: 0, propertyId: 0, status: 'pending'}),[])

    const defaultSelectedBookingValue = useMemo(()=>{
        return {
            status: modalState?.selected?.bookings?.status
        }
        
    },[modalState])

    const allowedActions =  useMemo(()=>{

        const getAllowedStatus = (allowed = []) =>{
            return bookingStatus.filter(status => allowed.includes(status.key))
        }

        switch(query.filter.status){
            case 'pending':
                return getAllowedStatus(['confirmed','cancelled', 'pending'])
            case 'confirmed':
                return getAllowedStatus(['confirmed','for_checkin', 'cancelled'])
            case 'cancelled':
                return getAllowedStatus(['cancelled'])
            case 'for_checkin':
                return getAllowedStatus(['for_checkin','checked_in','cancelled'])
            case 'for_checkout':
                return getAllowedStatus(['for_checkout','checkout'])
            case 'checked_in':
                return getAllowedStatus(['checked_in','for_checkout'])
            case 'checkout':
                return getAllowedStatus(['checkout'])
            default: 
                return []
        }

    }, [query.filter.status])

    return <>
        <section className="p-6">
            <div className="p-5 border border-gray-300 bg-white rounded-xl">

            <section className="mb-2">
                <h2 className="text-lg fw-bold">Bookings</h2>

                <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] items-center justify-between gap-2">

                    <div>
                        <Button 
                            title="New Booking"  
                            onclick={()=> setModalState({
                                isOpen: true,
                                type: modalType.add
                            })} 
                            Icon={PlusCircle}
                        />
                    </div>

                        <GroupButton 
                            initialSelected={query.filter.status}
                            onClick={({key})=> setQuery(prev => ({...prev, filter: {...prev.filter,  status: key}}))}
                            buttons={[
                               {
                                    title: 'Pending',
                                    key: "pending"
                                },
                                {
                                    title: 'Confirmed',
                                    key: "confirmed"
                                },
                                {
                                    title: 'For Check-in',
                                    key: "for_checkin"
                                },
                                {
                                    title: 'Checked In',
                                    key: "checked_in"
                                },
                                {
                                    title: 'For Checkout',
                                    key: "for_checkout"
                                },
                                {
                                    title: 'Checked Out',
                                    key: "checkout"
                                },
                                 {
                                    title: 'Cancelled',
                                    key: "cancelled"
                                },
                            ]}
                        />
                </div>

            </section>

            <Table 
                title="Users"
                data={bookings?.data ?? [] } 
                headers={[
                {
                    key: '#',
                    title: '#',
                    style: 'w-1/10 text-center',
                    mapper: ({index})=>{
                        return index + 1
                    }
                },
                {
                    key: 'pointPerson.name',
                    title: 'Name',
                    style: 'w-1/10 text-center',
                },
                {
                    key: 'totalGuest',
                    title: 'Guest',
                    style: 'w-1/10 text-center',
                },
                {
                    key: 'customers.name',
                    title: 'Total',
                    style: 'w-1/10 text-center',
                    mapper: ({index})=> ('500.00')
                },
                {
                    key: 'customers.name',
                    title: 'Payment',
                    style: 'w-1/10 text-center',
                    mapper: ({index})=> ('0.00')
                },
                {
                    key: 'rooms.title',
                    title: 'Room',
                    style: 'w-1/10 text-center',
                },
                {
                    key: 'bookings.status',
                    title: 'Status',
                    style: 'w-1/10 text-center',
                },
                 {
                    key: 'bookings.timeIn',
                    title: 'In',
                    style: 'w-2/10 text-center',
                },
                {
                    key: 'bookings.timeOut',
                    title: 'Out',
                    style: 'w-2/10 text-center',
                },
                {
                    key: 'Action',
                    title: 'Action',
                    style: 'w-1/10 text-center',
                    mapper: ({content})=> {

                        return (
                            <div className="flex items-center justify-center">
                                <div className="flex gap-2 p-1">

                                    {content?.bookings.status === 'pending' && (
                                        <Button onclick={()=> setModalState({
                                            isOpen: true,
                                            selected: content,
                                            type: modalType.view
                                        })} Icon={Link}/>
                                    )}

                                    <Button onclick={()=> setModalState({
                                        isOpen: true,
                                        selected: content,
                                        type: modalType.view
                                    })} Icon={Eye}/>

                                    {content?.bookings.status !== 'cancelled' && (
                                        <Button onclick={()=> setModalState({
                                            isOpen: true,
                                            selected: content,
                                            type: modalType.edit
                                       })} Icon={Pencil}/>
                                    )}
                                </div>
                            </div>
                        )
                    }
                }, 
            ]} />
            </div>

            <Modal title="New Booking" isOpen={modalState.isOpen && modalState.type === modalType.add } 
                closeModal={() => handleOnCloseModalState()} >
                <ReactHookForm defaultValues={defaultCreationValue} watch={[selectedProperty]} listener={({resetField})=> resetField('roomId')} onSubmit={handleOnSubmitBooking} schema={bookingSchema} shouldClear={!modalState.isOpen}>
                    <section className="w-[500px] p-2">
                        
                        <FieldLabel className="mb-5" label="From" fieldName="timeIn">
                            <InputField className="border w-full border-gray-300 rounded outline-none p-2" name="timeIn" type="datetime-local" />
                        </FieldLabel>

                        <FieldLabel className="mb-5" label="To" fieldName="timeOut">
                            <InputField className="border w-full border-gray-300 rounded outline-none p-2" name="timeOut" type="datetime-local" />
                        </FieldLabel>

                        <FieldLabel className="mb-5" label="Property" fieldName="propertyId">
                            <SelectionField onChange={(e)=> setSelectedProperty(e.target.value)} name="propertyId" className="border w-full border-gray-300 rounded outline-none p-2 capitalize">
                                <option className="capitalize" value="0" disabled>Select Property</option>
                                {properties?.data.map(property => (
                                    <option className="capitalize" value={property.id}>{property.title}</option>
                                ))}
                            </ SelectionField>
                        </FieldLabel>

                         <FieldLabel className="mb-5" label="Room" fieldName="roomId">
                            <SelectionField name="roomId" className="border w-full border-gray-300 rounded outline-none p-2 capitalize">
                                <option className="capitalize" value="0" disabled>Select Room</option>
                                {rooms?.data.map(property => (
                                    <option className="capitalize" value={property.id}>{property.title}</option>
                                ))}
                            </ SelectionField>
                        </FieldLabel>

                        <InputField  className="border w-full border-gray-300 rounded outline-none p-2" name="status" type="hidden" />

                        <section className="flex justify-end items-center gap-2">
                            <Button additionlClass="text-indigo-500!"  type="submit" title="Confirm"/>
                            <Button onclick={handleOnCloseModalState} title="Cancel"/>
                        </section>
                    </section>
                </ReactHookForm>
            </Modal>

            <Modal 
                title="View Booking" 
                isOpen={modalState.isOpen && modalState.type === modalType.view } 
                closeModal={() => handleOnCloseModalState()} 
            >

                <ReactHookForm defaultValues={modalState.selected} schema={propertySchema} shouldClear={!modalState.isOpen}>
                    <section className="w-[500px] p-2">
                        <FieldLabel className="mb-5" label="Title" fieldName="title">
                            <InputField readOnly={true} className="border w-full border-gray-300 rounded outline-none p-2" name="title" />
                        </FieldLabel>

                        <section className="flex justify-end items-center gap-2">
                            <Button additionlClass="text-indigo-500!"  type="submit" title="Confirm"/>
                            <Button onclick={handleOnCloseModalState} title="Cancel"/>
                        </section>
                    </section>
                </ReactHookForm>
            </Modal>

            <Modal 
                title="Edit Booking" 
                isOpen={modalState.isOpen && modalState.type === modalType.edit } 
                closeModal={() => handleOnCloseModalState()} 
            >

                <ReactHookForm onSubmit={handleOnPatchBooking} defaultValues={defaultSelectedBookingValue} schema={bookingSchema.pick(['status'])} shouldClear={!modalState.isOpen}>
                    <section className="w-[500px] p-2">

                        <FieldLabel className="mb-5" label="Status" fieldName="status">
                            <SelectionField name="status" className="border w-full border-gray-300 rounded outline-none p-2 capitalize">
                                {allowedActions.map(status => (
                                    <option className="capitalize" value={status.key}>{status.title}</option>
                                ))}
                            </ SelectionField>
                        </FieldLabel>

                        <section className="flex justify-end items-center gap-2">
                            <Button additionlClass="text-indigo-500!"  type="submit" title="Confirm"/>
                            <Button onclick={handleOnCloseModalState} title="Cancel"/>
                        </section>
                    </section>
                </ReactHookForm>
            </Modal>

        </section>
    </>
}