import { Role } from '@/types/role';

export type ReportStatus =
    | 'pending_owner'
    | 'pending_renter'
    | 'owner_proposed'
    | 'owner_accepted'
    | 'renter_accepted'
    | 'renter_rejected'
    | 'admin_processing'
    | 'admin_resolved'
    | 'in_progress'
    | 'owner_completed'
    | 'renter_completed'
    | 'owner_not_resolved'
    | 'cancelled';

export type ReportType = 'incident' | 'violation';

export type ReportPriority = 'low' | 'medium' | 'high';

export interface IReport {
    id: number;
    title: string;
    priority: ReportPriority;
    type: ReportType;
    createdAt: Date;
    ownerId: string;
    renterId: string;
    contractId: string;
    status: ReportStatus;
    resolvedAt: string;
    compensation: number;
    proposed: string;
    reportChildId: number;
}

export interface IReportDetail {
    id: number;
    propertyId: string;
    contractId: string;
    ownerId: string;
    renterId: string;
    type: ReportType;
    priority: ReportPriority;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    owner: Owner;
    renter: Owner;
    reportChild: ReportChild[];
    history: IReportHistory[];
}

export interface Owner {
    userId: string;
    name: string;
}

export interface ReportChild {
    id: number;
    reportId: number;
    proposed: string;
    compensation: number;
    evidences: string[];
    resolvedAt: string;
    transactionId: null;
    status: ReportStatus;
    createdAt: string;
    updatedAt: string;
}

export interface IReportChild {
    id: number;
    reportId: number;
    proposed: string;
    compensation: number;
    evidences: string[];
    resolvedAt: string;
    transactionId: number | null;
    status: ReportStatus;
    createdAt: string;
    updatedAt: string;
}

export interface IReportHistory {
    id: number;
    reportId: number;
    status: ReportStatus;
    createdAt: string;
}

export interface IAdminResolveReport {
    choose: Role;
    reportId?: number;
    proposed?: string;
    compensation?: number;
    resolvedAt?: string;
}

export type ReportFilterStatus = 'pending' | 'resolved' | 'urgent' | 'all';
export type ReportSort = 'newest' | 'priority_asc' | 'priority_desc' | 'all';

export interface IReportFilterByAdmin {
    status: ReportFilterStatus;
    type: ReportType;
}

export interface IReportFilterByOwner {
    status: ReportFilterStatus;
    type: ReportType;
    sort: ReportSort;
}
