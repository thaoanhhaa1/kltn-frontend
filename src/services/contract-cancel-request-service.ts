import { IContract } from '@/interfaces/contract';
import {
    IContractCancelRequest,
    IContractCancelRequestDetail,
    ICreateContractCancelRequest,
    IUpdateContractCancelRequestStatus,
} from '@/interfaces/contract-cancel-request';
import http from '@/lib/http';

const ENDPOINT = '/contract-service/contract-cancellation-requests';

export const createContractCancelRequest = (data: ICreateContractCancelRequest) => {
    return http.post<{
        request: IContractCancelRequest;
        contract: IContract;
    }>(ENDPOINT, data);
};

export const updateContractCancelRequestStatus = ({ requestId, status }: IUpdateContractCancelRequestStatus) => {
    return http.patch<{
        request: IContractCancelRequest;
        contract: IContract;
    }>(`${ENDPOINT}/${requestId}`, { status });
};

export const getHandledContractCancelRequest = (contractId: string, token: string) => {
    return http.get<Array<IContractCancelRequestDetail>>(`${ENDPOINT}/handled/${contractId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const getNotHandledContractCancelRequest = (contractId: string, token: string) => {
    return http.get<IContractCancelRequestDetail>(`${ENDPOINT}/not-handled/${contractId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
