import {
    IContractOverviewByAdminRes,
    IContractOverviewByOwnerRes,
    ICountNewUserByTypeAndMonth,
    ICountPropertyByDistrict,
    ICountPropertyByType,
    ICountRentalRequestByDay,
    ICountRentalRequestByMonth,
    ICountRentalRequestByWeek,
    IGetContractCancellationRateByOwner,
    IGetRentalRequestRatingByOwner,
    IGetTenantDistributionByOwner,
    IIncomeExpenditure,
    IOverviewByAdminRes,
    IOverviewByOwnerRes,
    IPropertyOverviewByAdminRes,
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

export const getOverviewByAdmin = async (accessToken: string): Promise<IOverviewByAdminRes> => {
    const [propertyOverview, contractOverview] = await Promise.all([
        http.get<IPropertyOverviewByAdminRes>('/estate-manager-service/dashboard/admin/overview', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }),
        http.get<IContractOverviewByAdminRes>('/contract-service/dashboard/admin/overview', {
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

export const countNewUsersByTypeAndMonth = (accessToken: string) => {
    return http.get<Array<ICountNewUserByTypeAndMonth>>(
        '/estate-manager-service/dashboard/admin/count-new-users-by-type-and-month',
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    );
};

export const countPropertiesByType = (accessToken: string) => {
    return http.get<Array<ICountPropertyByType>>('/estate-manager-service/dashboard/admin/count-properties-by-type', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

export const countPropertiesByDistrict = (accessToken: string) => {
    return http.get<Array<ICountPropertyByDistrict>>(
        '/estate-manager-service/dashboard/admin/count-properties-by-city-and-district',
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    );
};

export const countRentalRequestByDay = (accessToken: string) => {
    return http.get<Array<ICountRentalRequestByDay>>('/contract-service/dashboard/admin/rental-request-by-day', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

export const countRentalRequestByWeek = (accessToken: string) => {
    return http.get<Array<ICountRentalRequestByWeek>>('/contract-service/dashboard/admin/rental-request-by-week', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

export const countRentalRequestByMonth = (accessToken: string) => {
    return http.get<Array<ICountRentalRequestByMonth>>('/contract-service/dashboard/admin/rental-request-by-month', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};
