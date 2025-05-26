import { useNotification } from "../context/NotificationContext.tsx";
import {useNavigate} from "react-router-dom";

export function useRequest() {
    const { notify } = useNotification();
    const navigate = useNavigate();

    const request = async <T>(promise: Promise<T>, options?: {
        successMessage?: string;
        errorMessage?: string;
        onSuccess?: (data: T) => void;
    }) => {
        try {
            const response = await promise;
            options?.onSuccess?.(response);
            if (options?.successMessage) notify('success', options.successMessage);
            return response;
        }
        catch (err: any) {
            if (err.response?.status === 500) {
                navigate('/internalservererror');
            } else if (err.response?.data?.errors) {
                const errors = err.response.data.errors;
                const messages = Object.values(errors).flat() as string[];

                messages.forEach((message) => {
                    notify('error', message);
                });

            } else {
                notify('error', options?.errorMessage ?? 'Что-то пошло не так');
            }
            throw err;
        }
    };

    return { request };
}