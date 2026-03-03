import { useEffect, useRef, useState } from "react"
import { X } from '@boxicons/react';

export default function Modal({isOpen, closeModal, title, children}){

    const dialogRef = useRef();

    useEffect(()=>{
        
        if(isOpen){
            dialogRef.current?.showModal();
        }else{
            dialogRef.current?.close();
        }

    },[isOpen, dialogRef])

    return <>
        <dialog className={`min-w-[100vw] min-h-[100vh] flex items-center justify-center bg-transparent ${isOpen ? '' : 'hidden'}`} ref={dialogRef}>
            <section className="bg-gray-50 p-2 rounded-lg border border-gray-300 min-w-[300px]">
                <div className="mb-2 border-b border-gray-300 p-2 flex items-center justify-between text-md">
                    <p>{title}</p>
                    <span className="cursor-pointer text-gray-500">
                       <X  size="sm" onClick={closeModal}/>
                    </span>
                </div>
                 {children}
            </section>            
        </dialog>
    </>
}