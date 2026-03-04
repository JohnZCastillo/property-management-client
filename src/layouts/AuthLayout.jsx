import { Outlet, useLocation } from "react-router";
import { useLoaderData } from "react-router";
import { useNavigate } from "react-router";
import { Menu, ChartGantt, Buildings, Wallet, Checklist, User } from '@boxicons/react';
import SideNav from "../components/SideNav";
import { useDispatch, useSelector } from "react-redux";
import { toggleMenuState, updateMenuState } from "../store/store";
import normalizePath from "../utils/normalizePath";
import Button from "../components/Button";
import toast, { Toaster } from "react-hot-toast";

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
                <section className="bg-white px-5 h-[10%] flex items-center gap-3">

                    <Menu className="cursor-pointer hover:text-indigo-500" onClick={()=> dispatch(toggleMenuState())}/>

                    <div className="flex gap-1 items-center">
                        {normalizePath(location.pathname).map((path, index, array) => (
                            <>
                                <button 
                                    className="cursor-pointer capitalize" 
                                    type="button" 
                                    onClick={()=> navigate(index === 0 ? `/${path}` : path)}
                                > 
                                    {path}
                                </button>

                                {array.length !== (index + 1) && (
                                    <span>/</span>
                                )}
                            </>
                        ))}
                    </div>
                </section>
                <section className="p-2 min-h-[90%] bg-gray-50">
                    <Outlet/>
                </section>
            </main>
        </div>
        <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toasterId="default"
            toastOptions={{
                // Define default options
                className: '',
                duration: 5000,
                removeDelay: 1000,
                style: {
                background: '#363636',
                color: '#fff',
                },

                // Default options for specific types
                success: {
                duration: 3000,
                iconTheme: {
                    primary: 'green',
                    secondary: 'black',
                },
                },
            }}
        />

    </>
}