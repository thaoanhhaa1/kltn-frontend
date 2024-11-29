export interface ITransaction {
    id: number;
    fromId: string;
    toId: string | null;
    contractId: string;
    amount: number;
    amountEth: number | null;
    fee: number | null;
    feeEth: number | null;
    transactionHash: string | null;
    status: TransactionStatus;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    endDate: string | null;
    type: TransactionType;
}

export type TransactionType =
    | 'DEPOSIT'
    | 'RENT'
    | 'WITHDRAW'
    | 'REFUND'
    | 'CREATE_CONTRACT'
    | 'CANCEL_CONTRACT'
    | 'END_CONTRACT'
    | 'COMPENSATION'
    | 'REPORT';

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
    feeEth: number | null;
    transactionHash: string | null;
    title: string;
    description: string;
    updatedAt: string;
    fromId: string | null;
    toId: string | null;
}

export interface ITransactionDetail {
    id: number;
    fromId: string;
    toId: string;
    contractId: string;
    amount: number;
    amountEth: number;
    fee: number;
    feeEth: number;
    transactionHash: string;
    status: TransactionStatus;
    title: string;
    type: TransactionType;
    description: string;
    endDate: string;
    createdAt: Date;
    updatedAt: Date;
    from: IUser;
    to: IUser;
}

export interface IUser {
    userId: string;
    name: string;
}
