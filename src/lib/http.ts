import { envConfig, isClient } from '@/config/envConfig';
import CustomError, { EntryError } from '@/lib/error';

type CustomRequestInit = RequestInit & {
    baseUrl?: string;
    params?: Record<string, any>;
};

const request = async <Response>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    url: string,
    int?: CustomRequestInit,
) => {
    const isFormData = int?.body instanceof FormData;

    const baseHeaders: HeadersInit = {};

    if (!isFormData) baseHeaders['Content-Type'] = 'application/json';

    const baseUrl = int?.baseUrl ?? envConfig.NEXT_PUBLIC_API_URL;
    const body = int?.body ? (isFormData ? int.body : JSON.stringify(int.body)) : undefined;

    if (typeof int?.baseUrl === 'undefined') {
        if (isClient) {
            const res = await fetch('/api/auth/access-token', {
                method: 'POST',
            });
            const data = await res.json();

            baseHeaders['Authorization'] = `Bearer ${data.data}`;
        }
    }

    const paramsQuery = int?.params ? '?' + new URLSearchParams(int?.params).toString() : '';

    const res = await fetch(`${baseUrl}${url}${paramsQuery}`, {
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
            throw new CustomError(res.status, 'Unauthorized');
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

const patch = <Response>(url: string, body: any, init?: CustomRequestInit) =>
    request<Response>('PATCH', url, { ...init, body });

const del = <Response>(url: string, body: any, init?: CustomRequestInit) =>
    request<Response>('DELETE', url, { ...init, body });

const http = {
    get,
    post,
    put,
    patch,
    delete: del,
};

export default http;
