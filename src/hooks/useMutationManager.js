import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

const useMutationManager = ({mutationFn, invalidateQueryKeys = []})=>{

    const queryClient = useQueryClient();

    const mutation = useMutation({ 
        mutationFn: (data)=> {
            
            const mutationPromise = mutationFn(data);

            toast.promise(mutationPromise, {
                loading: 'Loading',
                success: 'Success',
                error: (error) => {
                    
                    if(error instanceof AxiosError && error.status === 400){
                        return error?.response?.data?.message;
                    }

                    return 'Something went wrong, please try agin';
                },
            })

            return mutationPromise;
        },
        onSuccess: ()=> {
            queryClient.invalidateQueries({ queryKey: invalidateQueryKeys });
        },
        onError: (err) => {
            console.log(err);
        }
    }, queryClient)

    return mutation;
 }

 export default useMutationManager;