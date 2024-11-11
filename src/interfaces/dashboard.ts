import { PropertyStatus } from '@/interfaces/property';
import { Role } from '@/types/role';

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

export interface IPropertyOverviewByAdminRes {
    usersByType: UsersByType[];
    newUsersInMonth: number;
    propertiesByStatus: PropertiesByStatus[];
    avgPrice: number;
}

export interface PropertiesByStatus {
    status: PropertyStatus;
    count: number;
}

export interface UsersByType {
    count: number;
    userType: Role;
}

export interface IContractOverviewByAdminRes {
    rentalRequestByStatus: RentalRequestByStatus;
    contractByStatus: ContractByStatus;
    transactionStats: TransactionStats;
}

export interface ContractByStatus {
    ONGOING: number;
    ENDED: number;
    WAITING: number;
}

export interface RentalRequestByStatus {
    APPROVED: number;
    REJECTED: number;
}

export interface TransactionStats {
    count: number;
    revenue: number;
    fee: number;
}

export type IOverviewByAdminRes = IPropertyOverviewByAdminRes & IContractOverviewByAdminRes;

export interface ICountNewUserByTypeAndMonth {
    renter: number;
    owner: number;
    month: number;
}

export interface ICountPropertyByType {
    type: string;
    count: number;
    avgPrice: number;
}

export interface ICountPropertyByDistrict {
    city: string;
    district: string;
    count: number;
}

export interface ICountRentalRequestByDay {
    day: number;
    count: number;
}

export interface ICountRentalRequestByWeek {
    week: number;
    count: number;
}

export interface ICountRentalRequestByMonth {
    month: number;
    count: number;
}
