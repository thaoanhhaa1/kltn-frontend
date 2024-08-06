import { envConfig } from '@/config/envConfig';
import CustomError, { EntryError } from '@/lib/error';

type CustomRequestInit = RequestInit & {
    baseUrl?: string;
};

const request = async <Response>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, int?: CustomRequestInit) => {
    const isFormData = int?.body instanceof FormData;

    const baseHeaders: HeadersInit = {};

    if (!isFormData) baseHeaders['Content-Type'] = 'application/json';

    const baseUrl = int?.baseUrl ?? envConfig.NEXT_PUBLIC_API_URL;
    const body = int?.body ? (isFormData ? int.body : JSON.stringify(int.body)) : undefined;

    const res = await fetch(`${baseUrl}${url}`, {
        ...int,
        headers: {
            ...baseHeaders,
            ...int?.headers,
        },
        method,
        body,
    });

    const result = await res.json();

    if (!res.ok) {
        if (result?.details) throw new EntryError(result.statusCode, result.message, result.details);
        else if (res.status === 401) {
            // Refresh token
        } else throw new CustomError(res.status, result.message);
    }

    const response = result as Response;

    return response;
};

const get = <Response>(url: string, init?: Omit<CustomRequestInit, 'body'>) => request<Response>('GET', url, init);

const post = <Response>(url: string, body: any, init?: CustomRequestInit) =>
    request<Response>('POST', url, { ...init, body });

const put = <Response>(url: string, body: any, init?: CustomRequestInit) =>
    request<Response>('PUT', url, { ...init, body });

const del = <Response>(url: string, body: any, init?: CustomRequestInit) =>
    request<Response>('DELETE', url, { ...init, body });

const http = {
    get,
    post,
    put,
    delete: del,
};

export default http;
