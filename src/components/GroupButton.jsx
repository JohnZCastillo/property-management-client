import { useEffect, useState } from "react"

export default function GroupButton({initialSelected, onClick, buttons = []}){

    const [selectedButton, setSelectedButton] = useState(null);

    const handleOnClick = (button)=>{
        
        setSelectedButton(button);
        
        if(onClick){
            onClick(button);
        }
    }

    useEffect(()=>{
        setSelectedButton({key: initialSelected});
    },[initialSelected])

    return <>
            <div className="flex items-center text-gray-800 cursor-pointer border rounded-lg border-gray-300 text-sm overflow-hidden">
                {buttons.map(({Icon, type, title, key}) => (
                    <button onClick={()=>handleOnClick({Icon, type, title, key})} type={type} className={`capitalize h-full grow [&:not(:last-child)]:border-r border-gray-300 px-3 py-2 cursor-pointer ${selectedButton?.key == key ? 'bg-indigo-500 text-white' : ''}`}>
                        {Icon && <Icon size="sm"/>}
                        {title}
                    </button>
                ))}
            </div>
    </>
}