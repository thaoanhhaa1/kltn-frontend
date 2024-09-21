import { IDepositTransaction, ITransaction } from '@/interfaces/transaction';
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
