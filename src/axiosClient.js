import axios from 'axios';

    
let headers = {
    'accept': 'application/json'
};



// const token = localStorage.getItem('token');

// if(token){
//     headers = {...headers, 'Authorization': `Bearer ${token}`}
// }

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api',
});

axiosClient.interceptors.request.use((config) => {
//   const token = Cookies.get("ACCESS_TOKEN");

  config.headers.Authorization = `Bearer ${import.meta.env.VITE_TOKEN}`;

  return config;
});


axiosClient.interceptors.response.use((res)=> res, (error) => {

        if(error.status === 401){
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            location.reload();
        }

        return  Promise.reject(error);
    }
);

export default axiosClient;