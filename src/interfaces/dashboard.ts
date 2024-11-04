export interface IPropertyOverviewByOwnerRes {
    countProperties: number;
    countUnavailableProperties: number;
}

export interface IContractOverviewByOwnerRes {
    countRentalRequest: number;
    countExtensionRequest: number;
    countCancelRequest: number;
    avgRevenue: {
        VND: number;
        ETH: number;
    };
}

export type IOverviewByOwnerRes = IPropertyOverviewByOwnerRes & IContractOverviewByOwnerRes;

export interface IIncomeExpenditure {
    month: string;
    income: number;
    expenditure: number;
}

export interface IGetContractCancellationRateByOwner {
    month: number;
    year: number;
    count: number;
}

export interface IGetRentalRequestRatingByOwner {
    month: number;
    year: number;
    APPROVED: number;
    PENDING: number;
    REJECTED: number;
}

export interface IGetTenantDistributionByOwner {
    city: string;
    district: string;
    count: number;
}
