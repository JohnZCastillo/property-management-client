import { useState } from "react";
import Table from "../../components/Table";
import {  PlusCircle, Pencil, Trash, Eye } from '@boxicons/react';
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import ReactHookForm, { FieldLabel, InputField } from "../../components/ReactHookForm";
import { propertySchema } from "../../schema/Schema";
import modalType from "../../constant/ModalType";

export default function Index(){

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [modalState, setModalState] = useState({
        isOpen: false,
        selected: null,
        type: modalType.none
    });

    const handleOnCloseModalState = ()=>{
        setModalState({
            isOpen: false,
            selected: null,
            type: modalType.none
         })
    }

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
            data={[
                {
                    name: "John",
                    firstName: "John",
                    middleName: "Zuniga",
                    lastName: "Castillo"
                },
                {
                    name: "James",
                    firstName: "James",
                    middleName: "Zuniga",
                    lastName: "Castillo"
                }
            ]} 
        
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
                key: 'firstName',
                title: 'Name',
                style: 'w-3/10 text-center',
            },
            {
                key: '#',
                title: 'Rooms',
                style: 'w-1/10 text-center',
                mapper: ({index})=>{
                    return index + 1
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

        <Modal title="New Property" isOpen={modalState.isOpen && modalState.type === modalType.add } 
            closeModal={() => handleOnCloseModalState()} >
            <ReactHookForm schema={propertySchema} shouldClear={!modalState.isOpen}>
                <section className="w-[500px] p-2">
                    <FieldLabel className="mb-5" label="Name" fieldName="name">
                        <InputField className="border w-full border-gray-300 rounded outline-none p-2" name="name" />
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
                    <FieldLabel className="mb-5" label="Name" fieldName="name">
                        <InputField readOnly={true} className="border w-full border-gray-300 rounded outline-none p-2" name="name" />
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

            <ReactHookForm defaultValues={modalState.selected} schema={propertySchema} shouldClear={!modalState.isOpen}>
                <section className="w-[500px] p-2">
                    <FieldLabel className="mb-5" label="Name" fieldName="name">
                        <InputField className="border w-full border-gray-300 rounded outline-none p-2" name="name" />
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