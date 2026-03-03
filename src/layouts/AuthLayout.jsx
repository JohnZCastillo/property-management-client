import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { useLoaderData } from "react-router";
import { useNavigate } from "react-router";
import { Alarm, ChartGantt, Buildings, Wallet, Checklist, User } from '@boxIcons/react';
import SideNav from "../components/SideNav";
import { useDispatch, useSelector } from "react-redux";
import { toggleMenuState, updateMenuState } from "../store/store";

export default function AuthLayout(){

    const { isLogin } = useLoaderData();
    const navigate = useNavigate();
    const location = useLocation();

    const appState = useSelector(state => state);

    const dispatch = useDispatch();

    // useEffect(()=>{
    //     if(!isLogin){
    //       navigate('/login');
    //     }
    // },[location.pathname])

    const links = [
        {
            Icon: ChartGantt,
            title: "Dashboard",
            link: "/home"
        },
        {
            Icon: Buildings,
            title: "Properties",
            link: "/home/properties"
        },
        {
            Icon: Wallet,
            title: "Expenses",
            link: "/home/expenses"
        }, 
        {
            Icon: Checklist,
            title: "Job Order",
            link: "/home/job-orders"
        },
        {
            Icon: User,
            title: "Staff",
            link: "/home/staffs"
        },
    ];

    return <>
        <div className="grid grid-cols-[auto_1fr]">
            <SideNav links={links}/>
            <main className="min-h-screen">
                <section className="bg-white px-2 h-[10%]">
                    <button onClick={()=> dispatch(toggleMenuState())}>burger</button>
                    {appState.page.title}
                </section>
                <section className="p-2 min-h-[90%] bg-gray-50">
                    <Outlet/>
                </section>
            </main>
        </div>
    </>
}