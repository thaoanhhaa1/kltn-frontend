import { IFilterPayment } from '@/app/(base)/payments/payments';
import { ITable } from '@/interfaces/table';
import {
    IDepositTransaction,
    IGetHistoryTransactions,
    ITransaction,
    ITransactionDetail,
} from '@/interfaces/transaction';
import http from '@/lib/http';

export const getTransactionsByRenter = (params: IFilterPayment) => {
    return http.get<Array<ITransaction>>('/contract-service/transactions/renter', {
        params,
    });
};

export const deposit = (data: IDepositTransaction) => {
    return http.post('/contract-service/contracts/deposit', data);
};

export const rentPayment = (data: IDepositTransaction) => {
    return http.post('/contract-service/contracts/pay', data);
};

export const getHistoryTransactions = (data: IGetHistoryTransactions) => {
    return http.get<ITable<ITransactionDetail>>(`/contract-service/transactions`, {
        params: data,
    });
};

export const getTransactionsByContract = (contractId: string) => {
    return http.get<Array<ITransactionDetail>>(`/contract-service/contracts/${contractId}/transactions`);
};
