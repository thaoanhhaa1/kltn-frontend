import { ITable } from '@/interfaces/table';
import { IDepositTransaction, ITransaction, ITransactionType } from '@/interfaces/transaction';
import http from '@/lib/http';

export const getTransactionsByRenter = (accessToken: string) => {
    return http.get<Array<ITransaction>>('/contract-service/transactions/renter', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

export const deposit = (data: IDepositTransaction) => {
    return http.post('/contract-service/contracts/deposit', data);
};

export const rentPayment = (data: IDepositTransaction) => {
    return http.post('/contract-service/contracts/pay', data);
};

export const getHistoryTransactions = (type: ITransactionType) => {
    return http.get<ITable<ITransaction>>(`/contract-service/transactions?type=${type}`);
};

export const getTransactionsByContract = (contractId: string) => {
    return http.get<Array<ITransaction>>(`/contract-service/contracts/${contractId}/transactions`);
};
