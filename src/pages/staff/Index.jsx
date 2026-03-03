import { useState } from "react";
import Table from "../../components/Table";
import { PlusCircle } from '@boxicons/react';
import Button from "../../components/Button";

export default function Index(){

    return <>
    <section className="p-6">
        <div className="p-5 border border-gray-300 bg-white rounded-xl">

        <section className="mb-2">
            <h2 className="text-lg fw-bold">Properties</h2>
            <Button title="New Property" Icon={PlusCircle} />
        </section>

        <Table 
            title="Users"
            data={[
                {
                    firstName: "John",
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
                title: 'Test',
                style: 'w-3/10 text-center',
            },
            {
                key: 'middleName',
                title: 'Test',
                style: 'w-3/10 text-center',
            }, 
            {
                key: 'lastName',
                title: 'Test',
                style: 'w-3/10 text-center',
            }
        ]} />
        </div>
    </section>
    </>
}