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
