import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { useLoaderData } from "react-router";
import { useNavigate } from "react-router";
import { Alarm, Twitter, Home } from '@boxicons/react';
import SideNav from "../components/SideNav";

export default function AuthLayout(){

    const { isLogin } = useLoaderData();
    const navigate = useNavigate();
    const location = useLocation();

    // useEffect(()=>{
    //     if(!isLogin){
    //       navigate('/login');
    //     }
    // },[location.pathname])

    const links = [
        {
            icon: <Alarm />,
            title: "Dashboard",
            link: "/test"
        },
        {
            icon: <Alarm />,
            title: "Properties",
            link: "/test"
        },
        {
            icon: <Alarm />,
            title: "Expenses",
            link: "/test"
        }, 
        {
            icon: <Alarm />,
            title: "Job Order",
            link: "/test"
        },
        {
            icon: <Alarm />,
            title: "Staff",
            link: "/test"
        },
        // test
         {
            icon: <Alarm />,
            title: "Dashboard",
            link: "/test"
        },
        {
            icon: <Alarm />,
            title: "Properties",
            link: "/test"
        },
        {
            icon: <Alarm />,
            title: "Expenses",
            link: "/test"
        }, 
        {
            icon: <Alarm />,
            title: "Job Order",
            link: "/test"
        },
        {
            icon: <Alarm />,
            title: "Staff",
            link: "/test"
        },
        // test
         {
            icon: <Alarm />,
            title: "Dashboard",
            link: "/test"
        },
        {
            icon: <Alarm />,
            title: "Properties",
            link: "/test"
        },
        {
            icon: <Alarm />,
            title: "Expenses",
            link: "/test"
        }, 
        {
            icon: <Alarm />,
            title: "Job Order",
            link: "/test"
        },
        {
            icon: <Alarm />,
            title: "Staff",
            link: "/test"
        }
    ];

    return <>
    
    <div className="grid grid-cols-[200px_1fr] min-h-screen">
        <aside className="bg-gray-500 px-3 py-5 max-h-screen">
            <h1 className="mb-2 text-center">Property Management</h1>
            <SideNav links={links}/>
        </aside>
        <main className="px-3 py-5 bg-orange-500">
            <Outlet/>
        </main>
    </div>
    </>
}