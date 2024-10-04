export interface ITransaction {
    id: number;
    fromId: string;
    toId: string | null;
    contractId: string;
    amount: number;
    amountEth: number | null;
    fee: number | null;
    transactionHash: string | null;
    status: TransactionStatus;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    endDate: string | null;
}

export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'OVERDUE' | 'CANCELLED';

export interface IDepositTransaction {
    contractId: string;
    transactionId: number;
}

export type ITransactionType = 'ALL' | 'INCOME' | 'OUTCOME';

export interface IHistoryTransaction {
    id: number;
    amount: number;
    amountEth: number | null;
    fee: number | null;
    transactionHash: string | null;
    title: string;
    description: string;
    updatedAt: string;
    fromId: string | null;
    toId: string | null;
}
