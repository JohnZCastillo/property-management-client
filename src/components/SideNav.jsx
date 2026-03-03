import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { changePage } from '../store/store';
import normalizePath from './../utils/normalizePath';

function LinkButton({Icon, title, link, onClick, iconOnly }){

    const location = useLocation();


    const [basePath, activePath] = normalizePath(location.pathname);
    const [linkBasePath, linkActivePath] = normalizePath(link);

    const isActive = activePath === linkActivePath;

    return (
        <button 
            onClick={()=> onClick({link, title})} 
            className={`cursor-pointer px-3 py-2 flex gap-1 items-center text-sm ${isActive ? 'nav-active' : ''}`} 
            type="button"
        >
            {Icon && <Icon /> }

            {!iconOnly && title}
        </button>
    )
}

export default function SideNav({links}){

    const dispatch = useDispatch();

    const appState = useSelector(state => state);

    const navigate = useNavigate();

    const handleOnNavigate = ({link, title})=>{
        dispatch(changePage({link,title}));
        navigate(link)
    }

    return (
        <aside className={`${appState.isMenuShowing ? 'min-w-[200px]' : 'min-w-[70px]'} bg-white border border-r border-gray-300 px-3 py-5 h-screen overflow-auto`}>
            <nav className="flex flex-col overflow-auto custom-scrollbar">
                {links.map(link => <LinkButton {...link}  iconOnly={!appState.isMenuShowing} onClick={handleOnNavigate}/>)}
            </nav>
        </aside>
    )
}
