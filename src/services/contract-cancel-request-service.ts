import { IContract } from '@/interfaces/contract';
import {
    IContractCancelRequest,
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
