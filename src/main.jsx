import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router/dom";
import router from './router';
import './index.css'
import { QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {store} from './store/store'
import { Provider } from 'react-redux'


const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
     <QueryClientProvider client={queryClient}>
       <RouterProvider router={router} />
     </QueryClientProvider>
    </Provider>
  </StrictMode>
)
