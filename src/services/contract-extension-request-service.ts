import {
    ICreateExtensionRequest,
    IExtensionRequest,
    IGetExtensionRequestByContractId,
    IUpdateExtensionRequestStatus,
} from '@/interfaces/contract-extension-request';
import http from '@/lib/http';

const ENDPOINT = '/contract-service/contract-extension-requests';

export const createExtensionRequest = async (data: ICreateExtensionRequest) => {
    return http.post<IExtensionRequest>(ENDPOINT, data);
};

export const updateExtensionRequestStatus = async (data: IUpdateExtensionRequestStatus) => {
    return http.patch<IExtensionRequest>(ENDPOINT, data);
};

export const getExtensionRequestByContractId = async ({
    contractId,
    accessToken,
}: IGetExtensionRequestByContractId) => {
    return http.get<IExtensionRequest[]>(`${ENDPOINT}/contracts/${contractId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};
