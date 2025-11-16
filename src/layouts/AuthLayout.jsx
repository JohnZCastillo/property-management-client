import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { useLoaderData } from "react-router";
import { useNavigate } from "react-router";

export default function AuthLayout(){

    const { isLogin } = useLoaderData();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(()=>{
        if(!isLogin){
          navigate('/login');
        }
    },[location.pathname])

    return <><Outlet/></>
}