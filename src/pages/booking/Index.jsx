import { useMemo, useState } from "react";
import Table from "../../components/Table";
import {  AlertTriangle, PlusCircle, Pencil, Trash, Eye } from '@boxicons/react';
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import ReactHookForm, { FieldLabel, InputField, SelectionField } from "../../components/ReactHookForm";
import { bookingSchema, deleteSchema, propertySchema } from "../../schema/Schema";
import modalType from "../../constant/ModalType";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../../axiosClient";
import endpoints from "../../endpoints";
import useMutationManager from "../../hooks/useMutationManager";

export default function Index(){

    const navigate = useNavigate();

    const [selectedProperty,setSelectedProperty] = useState(null);

    const [modalState, setModalState] = useState({
        isOpen: false,
        selected: null,
        type: modalType.none
    });

    const { mutate: propertyMutation } = useMutationManager({ 
        mutationFn: (data) => axiosClient.post(endpoints.properties, data),
        invalidateQueryKeys: ['propertiesData'],
    })

    const { mutate: patchPropertyMutation } = useMutationManager({ 
        mutationFn: (data) => axiosClient.patch(`${endpoints.properties}/${data?.id}`, data),
        invalidateQueryKeys: ['propertiesData'],
    })

    const { mutate: deletePropertyMutation } = useMutationManager({ 
        mutationFn: (data) => axiosClient.delete(`${endpoints.properties}/${data?.id}`, data),
        invalidateQueryKeys: ['propertiesData'],
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

    const handleOnSubmitProperties = (formData)=>{
        propertyMutation({...formData});
        handleOnCloseModalState();
    }

    const handleOnPatchProperties = (formData)=>{
        patchPropertyMutation({...formData, id: modalState?.selected?.id});
        handleOnCloseModalState();
    }

    const handleOnDeleteProperties = ()=>{
        deletePropertyMutation({ id: modalState?.selected?.id});
        handleOnCloseModalState();
    }

    const { data: bookings } = useQuery({
        queryKey: ['bookingsData'],
        queryFn: () => fetchBookings()
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

    const defaultCreationValue =  useMemo(()=> ({roomId: 0, propertyId: 0}),[])

    return <>
        <section className="p-6">
            <div className="p-5 border border-gray-300 bg-white rounded-xl">

            <section className="mb-2">
                <h2 className="text-lg fw-bold">Bookings</h2>

                <Button 
                    title="New Booking"  
                    onclick={()=> setModalState({
                        isOpen: true,
                        type: modalType.add
                    })} 
                    Icon={PlusCircle}
                />

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
                    key: 'customers.name',
                    title: 'Name',
                    style: 'w-1/10 text-center',
                },
                {
                    key: 'bookings.status',
                    title: 'Status',
                    style: 'w-1/10 text-center',
                },
                 {
                    key: 'bookings.timeIn',
                    title: 'Time out',
                    style: 'w-2/10 text-center',
                },
                {
                    key: 'bookings.timeOut',
                    title: 'Time In',
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
                                    
                                    <Button onclick={()=> setModalState({
                                        isOpen: true,
                                        selected: content,
                                        type: modalType.view
                                    })} Icon={Eye}/>


                                    <Button onclick={()=> setModalState({
                                        isOpen: true,
                                        selected: content,
                                        type: modalType.edit
                                    })} Icon={Pencil}/>

                                    <Button onclick={()=> setModalState({
                                        isOpen: true,
                                        selected: content,
                                        type: modalType.delete
                                    })} Icon={Trash}/>
                                </div>
                            </div>
                        )
                    }
                }, 
            ]} />
            </div>

            <Modal title="New Booking" isOpen={modalState.isOpen && modalState.type === modalType.add } 
                closeModal={() => handleOnCloseModalState()} >
                <ReactHookForm defaultValues={defaultCreationValue} watch={[selectedProperty]} listener={({resetField})=> resetField('roomId')} onSubmit={handleOnSubmitProperties} schema={bookingSchema} shouldClear={!modalState.isOpen}>
                    <section className="w-[500px] p-2">
                        
                        <FieldLabel className="mb-5" label="Name" fieldName="name">
                            <InputField className="border w-full border-gray-300 rounded outline-none p-2" name="name" />
                        </FieldLabel>

                        <FieldLabel className="mb-5" label="Email" fieldName="email">
                            <InputField className="border w-full border-gray-300 rounded outline-none p-2" name="email" />
                        </FieldLabel>

                        <FieldLabel className="mb-5" label="Contact" fieldName="contact">
                            <InputField className="border w-full border-gray-300 rounded outline-none p-2" name="contact" />
                        </FieldLabel>

                        <FieldLabel className="mb-5" label="Age" fieldName="age">
                            <InputField className="border w-full border-gray-300 rounded outline-none p-2" name="age" />
                        </FieldLabel>

                        <FieldLabel className="mb-5" label="From" fieldName="from">
                            <InputField className="border w-full border-gray-300 rounded outline-none p-2" name="from" type="datetime-local" />
                        </FieldLabel>

                        <FieldLabel className="mb-5" label="To" fieldName="to">
                            <InputField className="border w-full border-gray-300 rounded outline-none p-2" name="to" type="datetime-local" />
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

                <ReactHookForm onSubmit={handleOnPatchProperties} defaultValues={modalState.selected} schema={propertySchema} shouldClear={!modalState.isOpen}>
                    <section className="w-[500px] p-2">
                        <FieldLabel className="mb-5" label="Title" fieldName="title">
                            <InputField className="border w-full border-gray-300 rounded outline-none p-2" name="title" />
                        </FieldLabel>

                        <section className="flex justify-end items-center gap-2">
                            <Button additionlClass="text-indigo-500!"  type="submit" title="Confirm"/>
                            <Button onclick={handleOnCloseModalState} title="Cancel"/>
                        </section>
                    </section>
                </ReactHookForm>
            </Modal>

             <Modal 
                title="Delete Booking" 
                isOpen={modalState.isOpen && modalState.type === modalType.delete } 
                closeModal={() => handleOnDeleteProperties()} 
            >

                <ReactHookForm defaultValues={modalState.selected} schema={deleteSchema} onSubmit={handleOnDeleteProperties}  shouldClear={!modalState.isOpen}>
                    <section className="w-[500px] p-2">

                        <InputField type="hidden" className="border w-full border-gray-300 rounded outline-none p-2" name="id" />

                        <div className="mb-5 flex items-center gap-2">
                            <span className="text-red-500">
                                <AlertTriangle size="md" />
                            </span>
                            <p>
                                Are you sure you want to delete property 
                                <span className="ms-1 text-red-500">
                                  {modalState?.selected?.title}
                                </span>  ?
                            </p>
                        </div>

                        <section className="flex justify-end items-center gap-2">
                            <Button additionlClass="text-red-500!"  type="submit" title="Confirm"/>
                            <Button onclick={handleOnCloseModalState} title="Cancel"/>
                        </section>
                    </section>
                </ReactHookForm>
            </Modal>

        </section>
    </>
}