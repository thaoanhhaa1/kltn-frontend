import {
    IContractOverviewByOwnerRes,
    IGetContractCancellationRateByOwner,
    IGetRentalRequestRatingByOwner,
    IGetTenantDistributionByOwner,
    IIncomeExpenditure,
    IOverviewByOwnerRes,
    IPropertyOverviewByOwnerRes,
} from '@/interfaces/dashboard';
import http from '@/lib/http';

export const getOverviewByOwner = async (accessToken: string): Promise<IOverviewByOwnerRes> => {
    const [propertyOverview, contractOverview] = await Promise.all([
        http.get<IPropertyOverviewByOwnerRes>('/estate-manager-service/dashboard/owner/overview', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }),
        http.get<IContractOverviewByOwnerRes>('/contract-service/dashboard/owner/overview', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }),
    ]);

    return {
        ...propertyOverview,
        ...contractOverview,
    };
};

export const getIncomeExpenditureByOwner = async (accessToken: string): Promise<IIncomeExpenditure[]> => {
    return http.get<IIncomeExpenditure[]>('/contract-service/dashboard/owner/income-expenditure', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

export const getContractCancellationRateByOwner = (
    accessToken: string,
): Promise<Array<IGetContractCancellationRateByOwner>> => {
    return http.get<Array<IGetContractCancellationRateByOwner>>(
        '/contract-service/dashboard/owner/contract-cancellation-rate',
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    );
};

export const getRentalRequestRatingByOwner = (accessToken: string): Promise<Array<IGetRentalRequestRatingByOwner>> => {
    return http.get<Array<IGetRentalRequestRatingByOwner>>('/contract-service/dashboard/owner/rental-request-rating', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

export const getTenantDistributionByOwner = (accessToken: string): Promise<Array<IGetTenantDistributionByOwner>> => {
    return http.get<Array<IGetTenantDistributionByOwner>>('/contract-service/dashboard/owner/tenant-distribution', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};
