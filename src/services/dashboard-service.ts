import { IContractOverviewByOwnerRes, IOverviewByOwnerRes, IPropertyOverviewByOwnerRes } from '@/interfaces/dashboard';
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