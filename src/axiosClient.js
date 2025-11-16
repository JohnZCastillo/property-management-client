import axios from 'axios';

const getClient = (base)=>{
    
    let headers = {
        'accept': 'application/json'
    };

    const token = localStorage.getItem('token');

    if(token){
        headers = {...headers, 'Authorization': `Bearer ${token}`}
    }

    const axiosClient = axios.create({
        baseURL: base ?? (import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api'),
        headers: headers
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

    return axiosClient;
}

export default getClient;