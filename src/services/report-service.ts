import { IReport, IReportChild, IReportDetail } from '@/interfaces/report';
import http from '@/lib/http';

const ENDPOINT = '/contract-service/reports';

export const findReportsByContractId = async (contractId: string) => {
    const response = await http.get<Array<IReport>>(`${ENDPOINT}/contracts/${contractId}`);

    return response;
};

export const createReportByRenter = (formData: FormData) => {
    return http.post<IReport>(`${ENDPOINT}/renter`, formData);
};

export const cancelReportByRenter = (reportId: number) => {
    return http.post(`${ENDPOINT}/${reportId}/cancel`, {});
};

export const getReportDetailById = (reportId: string, accessToken: string) => {
    return http.get<IReportDetail>(`${ENDPOINT}/${reportId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

export const ownerAcceptReport = (data: { reportId: number; reportChildId: number }) => {
    return http.post<IReportChild>(`${ENDPOINT}/owner/accept`, data);
};

export const ownerProposeReport = (formData: FormData) => {
    return http.post<IReportChild>(`${ENDPOINT}/owner/propose`, formData);
};

export const renterRejectReport = (reportChildId: number) => {
    return http.post<IReportChild>(`${ENDPOINT}/renter/reject`, { reportChildId });
};

export const renterAcceptReport = (reportChildId: number) => {
    return http.post<IReportChild>(`${ENDPOINT}/renter/accept`, { reportChildId });
};

export const adminResolveReport = (formData: FormData) => {
    return http.post<IReportChild>(`${ENDPOINT}/admin/resolve`, formData);
};

export const ownerInProgressReport = (reportId: number) => {
    return http.post<IReportChild>(`${ENDPOINT}/owner/in-progress`, { reportId });
};

export const ownerCompleteReport = (reportId: number) => {
    return http.post<IReportChild>(`${ENDPOINT}/owner/complete`, { reportId });
};

export const renterCompleteReport = (reportId: number) => {
    return http.post<IReportChild>(`${ENDPOINT}/renter/complete`, { reportId });
};

export const ownerNotResolveReport = (reportId: number) => {
    return http.post<IReportChild>(`${ENDPOINT}/renter/owner-not-resolve`, { reportId });
};
