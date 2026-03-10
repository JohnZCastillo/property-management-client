import { useContext, useEffect, useMemo, useState } from "react"
import ReactHookForm, { FieldLabel, InputField, ReactHookFormContext } from "../components/ReactHookForm";
import { guestSchema } from "../schema/Schema";
import { v4 as uuidv4 } from 'uuid';
import { useSearchParams } from "react-router";

const GuestDetails = ({children, defaultValues, guest, totalGuest, onSubmit})=>{

    return <>

        <ReactHookForm defaultValues={defaultValues} onSubmit={onSubmit} schema={guestSchema} className="p-2 min-w-[300px] max-w-[800px] w-full p-5 border border-gray-300 rounded">

            <div className="mb-2">
                 <h2 className="mb-2 font-semibold text-[25px]">Guest Information</h2>
                 <h2 className="mb-2 text-md">Youre filling up information for guest number {guest}</h2>
                 <p className="text-sm text-gray-500 mb-2">Please provide accurate details for all guests. This information is required for check-in and billing.</p>
            
                <div className="flex items-center justify-center overflow-auto pb-2 custom-scrollbar">
                    <div className="flex items-center gap-5">
                            {new Array(totalGuest).fill('',0,totalGuest).map((_,index) =>(
                                <span className={`w-[50px] h-[20px] rounded-full ${index + 1== guest ? 'bg-indigo-500': 'bg-gray-500'}`}></span>
                            ))}
                    </div>
                </div>
            </div>

                <div className="p-2">

                    <InputField name="id" type="hidden" className="border rounded border-gray-500 outline-none px-2 py-1 w-full" />

                    <FieldLabel className="mb-2" fieldName="name" label="Name">
                        <InputField name="name" className="border rounded border-gray-500 outline-none px-2 py-1 w-full" />
                    </FieldLabel>

                    <FieldLabel className="mb-2" fieldName="email" label="Email">
                        <InputField name="email" className="border rounded border-gray-500 outline-none px-2 py-1 w-full" />
                    </FieldLabel>

                    <FieldLabel className="mb-2" fieldName="contact" label="Contact">
                        <InputField name="contact" className="border rounded border-gray-500 outline-none px-2 py-1 w-full" />
                    </FieldLabel>

                    <FieldLabel className="mb-2" fieldName="age" label="Age">
                        <InputField type="numeric" name="age" className="border rounded border-gray-500 outline-none px-2 py-1 w-full" />
                    </FieldLabel>
                </div>

            {children}
            
        </ReactHookForm>
    </>
}

const PrevButton = ({onSubmit})=>{

    const { getValues } = useContext(ReactHookFormContext);
    
    const handleOnCLick = ()=>{
        onSubmit(getValues());
    }

    return <>
      <button onClick={handleOnCLick} type="button" className="px-5 py-2 rounded bg-gray-500 text-white cursor-pointer">
        Prev
    </button>
    </>
}

export default function Fillup(){
    
    const [guest, setGuest] = useState({
        count: 2,
        phase: 1,
        details: []
    });

  const [searchParams, setSearchParams] = useSearchParams();

    useEffect(()=>{

        const count = parseInt( searchParams.get('guest_count') ?? '2');

        setGuest(prev => ({...prev, count:  count}))
    },[])


    console.log(guest);

    const handleOnClickPrev = (details)=>{
        
        const {id} = details;

        const isExisting = guest.details.find(info => info.id === id);
       
        setGuest(prev => ({
            ...prev, 
            phase: prev.phase - 1 <= 0 ? 1 : prev.phase - 1,
            details: isExisting  
                ? prev.details.map(info => ( info.id === details.id ? details : info)) 
                : [...prev.details, details]
            })
        )    
    }

    const handleOnClickSubmit = (details) =>{

        const {id} = details;

        const isLastPhase = guest.count === guest.phase;
        const isExisting = guest.details.find(info => info.id === id);

        if(isLastPhase){
             setGuest(prev => ({
                ...prev, 
                details: isExisting  
                    ? prev.details.map(info => ( info.id === details.id ? details : info)) 
                    : [...prev.details, details]
                })
            )    
        }else{
            setGuest(prev => ({
                ...prev, 
                phase: prev.phase + 1,
                details: isExisting  
                    ? prev.details.map(info => ( info.id === details.id ? details : info)) 
                    : [...prev.details, details]
                })
            )    
        }
    }

    const defaultValue = (id) => {
        const value = guest.details.find(info => info.id === id);
        return value == null ? {id: id} : value;
    }

    const fields = useMemo(()=>{
        const ids = [];

        for (let index = 0; index < guest.count; index++) {
            ids.push(uuidv4());
        }            

        return ids;

    },[guest.count])
    
    return <>
        <div className="flex items-center justify-center h-screen p-2">
            {fields.map((id,index) => (
                <>
                {index + 1 == guest.phase && ( 
                    <GuestDetails totalGuest={guest.count} defaultValues={defaultValue(id)} guest={index + 1} id={id} onSubmit={handleOnClickSubmit}> 

                        <div className="flex items-center gap-2">
                            {(guest.phase  != 1) && (
                            <PrevButton onSubmit={handleOnClickPrev}/>
                            )}

                            <button className="px-5 py-2 rounded bg-indigo-500 text-white cursor-pointer">
                                {guest.count === guest.phase ? 'Finish' : 'Next' }
                            </button>
                        </div>
                    </GuestDetails> )}
                </>
            ))}
        </div>
    </>
}