import { useState } from "react";
import Table from "../../components/Table";
import {  AlertTriangle, PlusCircle, Pencil, Trash, Eye } from '@boxicons/react';
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import ReactHookForm, { FieldLabel, InputField, SelectionField } from "../../components/ReactHookForm";
import { deleteSchema, roomSchema } from "../../schema/Schema";
import modalType from "../../constant/ModalType";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../../axiosClient";
import endpoints from "../../endpoints";
import roomStatus from "../../constant/RoomStatus";
import useMutationManager from "../../hooks/useMutationManager";


export default function Room(){

    const {id: propertyId} = useParams();

    const [modalState, setModalState] = useState({
        isOpen: false,
        selected: null,
        type: modalType.none
    });

    const { mutate: propertyMutation } = useMutationManager({ 
        mutationFn: (data) => axiosClient.post(endpoints.rooms, data),
        invalidateQueryKeys: ['roomData'],
    })

    const { mutate: patchPropertyMutation } = useMutationManager({ 
        mutationFn: (data) => axiosClient.patch(`${endpoints.rooms}/${data?.id}`, data),
        invalidateQueryKeys: ['roomData'],
    })

    const { mutate: deletePropertyMutation } = useMutationManager({ 
        mutationFn: (data) => axiosClient.delete(`${endpoints.rooms}/${data?.id}`, data),
        invalidateQueryKeys: ['roomData'],
    })

    const handleOnCloseModalState = ()=>{
        setModalState({
            isOpen: false,
            selected: null,
            type: modalType.none
         })
    }

    const fetchRooms = (params)=>{
        return axiosClient
            .get(endpoints.rooms, {params: {propertyId: propertyId, ...params}})
            .then(res => res.data);
    }

    const handleOnSubmitRoom = async (formData)=>{
        propertyMutation({...formData, propertyId: parseInt(propertyId)});
        handleOnCloseModalState();
    }

    const handleOnPatchRoom = (formData)=>{
        patchPropertyMutation({...formData, id: modalState?.selected?.id});
        handleOnCloseModalState();
    }

    const handleOnDeleteRoom = ()=>{
        deletePropertyMutation({ id: modalState?.selected?.id});
        handleOnCloseModalState();
    }

    const { data: rooms } = useQuery({
        queryKey: ['roomData', propertyId],
        queryFn: () => fetchRooms()
    })

    return <>
        <section className="p-6">
            <div className="p-5 border border-gray-300 bg-white rounded-xl">

            <section className="mb-2">
                <h2 className="text-lg fw-bold">Rooms</h2>

                <Button 
                    title="New Room"  
                    onclick={()=> setModalState({
                        isOpen: true,
                        type: modalType.add
                    })} 
                    Icon={PlusCircle}
                />

            </section>

            <Table 
                title="Users"
                data={rooms?.data ?? [] } 
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
                    key: 'title',
                    title: 'Title',
                    style: 'w-3/10 text-center',
                },
                {
                    key: 'amount',
                    title: 'Pricing',
                    style: 'w-3/10 text-center',
                },
                {
                    key: 'status',
                    title: 'Status',
                    style: 'w-3/10 text-center',
                    mapper: ({value})=>{
                        return value ?? '--'
                    }
                },
                {
                    key: 'Action',
                    title: 'Action',
                    style: 'w-3/10 text-center',
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

            <Modal title="New Room" isOpen={modalState.isOpen && modalState.type === modalType.add } 
                closeModal={() => handleOnCloseModalState()} >
                <ReactHookForm onSubmit={handleOnSubmitRoom} schema={roomSchema} shouldClear={!modalState.isOpen}>
                    <section className="w-[500px] p-2">
                        <FieldLabel className="mb-5" label="Title" fieldName="title">
                            <InputField className="border w-full border-gray-300 rounded outline-none p-2" name="title" />
                        </FieldLabel>

                        <FieldLabel className="mb-5" label="Pricing" fieldName="amount">
                            <InputField options={{step: 0.1}} type="number" className="border w-full border-gray-300 rounded outline-none p-2" name="amount" />
                        </FieldLabel>
                        
                        <FieldLabel className="mb-5" label="Status" fieldName="status">
                            <SelectionField name="status" className="border w-full border-gray-300 rounded outline-none p-2 capitalize">
                                {roomStatus.map(status => (
                                    <option className="capitalize" value={status}>{status}</option>
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
                title="View Room" 
                isOpen={modalState.isOpen && modalState.type === modalType.view } 
                closeModal={() => handleOnCloseModalState()} 
            >

                <ReactHookForm defaultValues={modalState.selected} schema={roomSchema} shouldClear={!modalState.isOpen}>
                    <section className="w-[500px] p-2">
                        <FieldLabel className="mb-5" label="Title" fieldName="title">
                            <InputField readOnly={true} className="border w-full border-gray-300 rounded outline-none p-2" name="title" />
                        </FieldLabel>

                        <FieldLabel className="mb-5" label="Pricing" fieldName="amount">
                            <InputField options={{step: 0.1}} type="number" className="border w-full border-gray-300 rounded outline-none p-2" name="amount" />
                        </FieldLabel>

                        <FieldLabel className="mb-5" label="Status" fieldName="status">
                            <InputField readOnly={true} className="border w-full border-gray-300 rounded outline-none p-2" name="status" />
                        </FieldLabel>


                        <section className="flex justify-end items-center gap-2">
                            <Button onclick={handleOnCloseModalState} title="Cancel"/>
                        </section>
                    </section>
                </ReactHookForm>
            </Modal>

            <Modal 
                title="Edit Room" 
                isOpen={modalState.isOpen && modalState.type === modalType.edit } 
                closeModal={() => handleOnCloseModalState()} 
            >

                <ReactHookForm onSubmit={handleOnPatchRoom} defaultValues={modalState.selected} schema={roomSchema} shouldClear={!modalState.isOpen}>
                    <section className="w-[500px] p-2">
                        <FieldLabel className="mb-5" label="Title" fieldName="title">
                            <InputField className="border w-full border-gray-300 rounded outline-none p-2" name="title" />
                        </FieldLabel>

                        <FieldLabel className="mb-5" label="Pricing" fieldName="amount">
                            <InputField options={{step: 0.1}} type="number" className="border w-full border-gray-300 rounded outline-none p-2" name="amount" />
                        </FieldLabel>

                        <FieldLabel className="mb-5" label="Status" fieldName="status">
                            <SelectionField name="status" className="border w-full border-gray-300 rounded outline-none p-2 capitalize">
                                {roomStatus.map(status => (
                                    <option className="capitalize" value={status}>{status}</option>
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
                title="Delete Room" 
                isOpen={modalState.isOpen && modalState.type === modalType.delete } 
                closeModal={() => handleOnDeleteRoom()} 
            >

                <ReactHookForm defaultValues={modalState.selected} schema={deleteSchema} onSubmit={handleOnDeleteRoom}  shouldClear={!modalState.isOpen}>
                    <section className="w-[500px] p-2">

                        <InputField type="hidden" className="border w-full border-gray-300 rounded outline-none p-2" name="id" />

                        <div className="mb-5 flex items-center gap-2">
                            <span className="text-red-500">
                                <AlertTriangle size="md" />
                            </span>
                            <p>
                                Are you sure you want to delete room 
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