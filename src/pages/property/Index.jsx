import { useState } from "react";
import Table from "../../components/Table";
import {  AlertTriangle, PlusCircle, Pencil, Trash, Eye } from '@boxicons/react';
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import ReactHookForm, { FieldLabel, InputField } from "../../components/ReactHookForm";
import { deleteSchema, propertySchema } from "../../schema/Schema";
import modalType from "../../constant/ModalType";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../../axiosClient";
import endpoints from "../../endpoints";
import useMutationManager from "../../hooks/useMutationManager";

export default function Index(){

    const navigate = useNavigate();

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

    const { data: properties } = useQuery({
        queryKey: ['propertiesData'],
        queryFn: () => fetchProperties()
    })

    return <>
        <section className="p-6">
            <div className="p-5 border border-gray-300 bg-white rounded-xl">

            <section className="mb-2">
                <h2 className="text-lg fw-bold">Properties</h2>

                <Button 
                    title="New Property"  
                    onclick={()=> setModalState({
                        isOpen: true,
                        type: modalType.add
                    })} 
                    Icon={PlusCircle}
                />

            </section>

            <Table 
                title="Users"
                data={properties?.data ?? [] } 
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
                    key: 'totalRooms',
                    title: 'Rooms',
                    style: 'w-1/10 text-center',
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
                                    
                                    <Button onclick={()=> navigate(`./${content.id}`)} Icon={Eye}/>

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

            <Modal title="New Property" isOpen={modalState.isOpen && modalState.type === modalType.add } 
                closeModal={() => handleOnCloseModalState()} >
                <ReactHookForm onSubmit={handleOnSubmitProperties} schema={propertySchema} shouldClear={!modalState.isOpen}>
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
                title="View Property" 
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
                title="Edit Property" 
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
                title="Delete Property" 
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