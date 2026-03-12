import { createBrowserRouter } from "react-router";
import DefaultLayout from "./layouts/DefaultLayout";
import Homepage from "./pages/Homepage";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Login";

import Property from  './pages/property/Index';
import Room from  './pages/property/Room';

import Expenses from  './pages/expenses/Index';
import Staff from  './pages/staff/Index';
import JobOrder from  './pages/job-order/Index';

import Booking from  './pages/booking/Index';

import FillUp from  './pages/Fillup';

const router = createBrowserRouter([
  {
    path: "/",
    Component: DefaultLayout,
    children: [
      {
        index: true,
        Component: Homepage
      },
      {
        path: 'login',
        Component: Login
      },
      {
        path: 'booking-fill-up/:companyId/:bookingId',
        Component: FillUp
      }
    ]
  },
  {
    path: "/home",
    Component: AuthLayout,
    loader: async ({ params }) => {
      return { isLogin: false };
    },
    children: [
      {
        index: true,
        Component: Homepage
      },
      {
        path: 'properties',
        children: [
          {
            index: true,
            Component: Property,
          },
          {
            path: ':id',
            Component: Room,
          }
        ]
      },
      {
        path: 'bookings',
        Component: Booking
      },
       {
        path: 'expenses',
        Component: Expenses
      },
      {
        path: 'job-orders',
        Component: JobOrder
      },
      {
        path: 'staffs',
        Component: Staff
      },
    ]
  },
]);

export default router;