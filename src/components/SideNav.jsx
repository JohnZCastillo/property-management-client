import { Alarm, Twitter, Home } from '@boxicons/react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
    

function LinkButton({icon, title, link, onClick, showIcon }){
    return (
        <button 
            onClick={()=> onClick(link)} 
            className="cursor-pointer bg-indigo-500 px-3 py-2 rounded flex gap-1 items-center text-white font-bold" 
            type="button"
        >
            {showIcon && icon}
            {title}
        </button>
    )
}

export default function SideNav({links}){

    const  [isIconShowing, setIsIconShowing] = useState(true);

    const navigate = useNavigate();

    const handleOnNavigate = (link)=>{
        navigate(link)
    }

    return (
         <nav className="flex flex-col gap-2 overflow-auto">
            {links.map(link => <LinkButton {...link}  showIcon={isIconShowing} onClick={handleOnNavigate}/>)}
        </nav>
    )
}
