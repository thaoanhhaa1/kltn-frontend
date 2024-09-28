export interface ITransaction {
    id: number;
    from_id: string;
    to_id: string | null;
    contract_id: string;
    amount: number;
    amount_eth: number | null;
    fee: number | null;
    transaction_hash: string | null;
    status: TransactionStatus;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
    end_date: string | null;
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
    amount_eth: number | null;
    fee: number | null;
    transaction_hash: string | null;
    title: string;
    description: string;
    updated_at: string;
    from_id: string | null;
    to_id: string | null;
}