export interface ICreateContractRequest {
    ownerUserId: string;
    renterUserId: string;
    propertyId: string;
    startDate: string;
    endDate: string;
    contractTerms: string;
    monthlyRent: number;
    depositAmount: number;
}

export interface IContract {
    contract_id: string;
    owner_user_id: string;
    renter_user_id: string;
    property_id: string;
    start_date: string;
    end_date: string;
    deleted: boolean;
    status: ContractStatus;
    created_at: string;
    updated_at: string;
    monthly_rent: number;
    deposit_amount: number;
    contract_terms: string;
    transaction_hash_contract: string;
}

export type ContractStatus = 'WAITING' | 'DEPOSITED' | 'ONGOING' | 'ENDED' | 'OVERDUE' | 'CANCELLED';
