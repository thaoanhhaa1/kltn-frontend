import { ITable } from '@/interfaces/table';
import {
    getContractStatusText,
    getPropertyStatusText,
    getRentalRequestStatusText,
    getUserStatusText,
} from '@/lib/utils';

export const initDataTable = {
    data: [],
    pageInfo: {
        current: 1,
        pageSize: 10,
        total: 0,
    },
} as ITable<any>;

export const interiorOptions = [
    {
        label: 'Đầy đủ nội thất',
        value: 'Đầy đủ nội thất',
    },
    {
        label: 'Nội thất cơ bản',
        value: 'Nội thất cơ bản',
    },
    {
        label: 'Không nội thất',
        value: 'Không nội thất',
    },
];

export const sortPropertyOptions = [
    {
        label: 'Thông thường',
        value: 'normal',
    },
    {
        label: 'Mới nhất',
        value: 'newest',
    },
    {
        label: 'Cũ nhất',
        value: 'oldest',
    },
    {
        label: 'Giá thấp đến cao',
        value: 'price_asc',
    },
    {
        label: 'Giá cao đến thấp',
        value: 'price_desc',
    },
];

export const typeReportOptions = [
    {
        label: 'Sự cố',
        value: 'incident',
    },
    {
        label: 'Vi phạm',
        value: 'violation',
    },
];

export const priorityReportOptions = [
    {
        label: 'Thấp',
        value: 'low',
    },
    {
        label: 'Trung bình',
        value: 'medium',
    },
    {
        label: 'Cao',
        value: 'high',
    },
];

export const statusReportAdminOptions = [
    {
        label: 'Chờ xử lý',
        value: 'pending',
    },
    {
        label: 'Xử lý gấp',
        value: 'urgent',
    },
];

export const statusReportOwnerOptions = [
    {
        label: 'Chờ xử lý',
        value: 'pending',
    },
    {
        label: 'Đã xử lý',
        value: 'resolved',
    },
];

export const typeReportOwnerOptions = [
    {
        label: 'Sự cố',
        value: 'incident',
    },
    {
        label: 'Vi phạm',
        value: 'violation',
    },
];

export const rentalRequestStatusOptions = [
    {
        label: getRentalRequestStatusText('PENDING'),
        value: 'PENDING',
    },
    {
        label: getRentalRequestStatusText('APPROVED'),
        value: 'APPROVED',
    },
    {
        label: getRentalRequestStatusText('REJECTED'),
        value: 'REJECTED',
    },
];

export const userTypeOptions = [
    {
        label: 'Chủ nhà',
        value: 'owner',
    },
    {
        label: 'Người thuê',
        value: 'renter',
    },
];

export const userStatusOptions = [
    {
        label: getUserStatusText('ACTIVE'),
        value: 'ACTIVE',
    },
    {
        label: getUserStatusText('INACTIVE'),
        value: 'INACTIVE',
    },
    {
        label: getUserStatusText('BLOCKED'),
        value: 'BLOCKED',
    },
];

export const propertyStatusOptions = [
    {
        label: getPropertyStatusText('PENDING'),
        value: 'PENDING',
    },
    {
        label: getPropertyStatusText('ACTIVE'),
        value: 'ACTIVE',
    },
    {
        label: getPropertyStatusText('REJECTED'),
        value: 'REJECTED',
    },
    {
        label: getPropertyStatusText('UNAVAILABLE'),
        value: 'UNAVAILABLE',
    },
];

export const contractStatusOptions = [
    {
        label: getContractStatusText('WAITING'),
        value: 'WAITING',
    },
    {
        label: getContractStatusText('DEPOSITED'),
        value: 'DEPOSITED',
    },
    {
        label: getContractStatusText('ONGOING'),
        value: 'ONGOING',
    },
    {
        label: getContractStatusText('ENDED'),
        value: 'ENDED',
    },
    {
        label: getContractStatusText('OVERDUE'),
        value: 'OVERDUE',
    },
    {
        label: getContractStatusText('CANCELLED'),
        value: 'CANCELLED',
    },
    {
        label: getContractStatusText('PENDING_CANCELLATION'),
        value: 'PENDING_CANCELLATION',
    },
    {
        label: getContractStatusText('UNILATERAL_CANCELLATION'),
        value: 'UNILATERAL_CANCELLATION',
    },
    {
        label: getContractStatusText('APPROVED_CANCELLATION'),
        value: 'APPROVED_CANCELLATION',
    },
    {
        label: getContractStatusText('REJECTED_CANCELLATION'),
        value: 'REJECTED_CANCELLATION',
    },
];

export const DEFAULT_SORT_PROPERTY = 'normal';

export const locations = [
    {
        title: 'Hà Nội',
        src: '/ha-noi-location.webp',
        href: '/ha-noi',
    },
    {
        title: 'TP. Hồ Chí Minh',
        src: '/bat-dong-san-hcm.webp',
        href: '/ho-chi-minh',
    },
    {
        title: 'Đà Nẵng',
        src: '/bat-dong-san-da-nang.webp',
        href: '/da-nang',
    },
    {
        title: 'Bình Dương',
        src: '/bat-dong-san-binh-duong.webp',
        href: '/binh-duong',
    },
    // {
    //     title: 'Cần Thơ',
    //     src: '/bat-dong-san-can-tho.webp',
    //     href: '/can-tho',
    // },
    // {
    //     title: 'Bà Rịa - Vũng Tàu',
    //     src: '/bat-dong-san-ba-ria-vung-tau.webp',
    //     href: '/ba-ria-vung-tau',
    // },
    // {
    //     title: 'Đồng Nai',
    //     src: '/bat-dong-san-dong-nai.webp',
    //     href: '/dong-nai',
    // },
    // {
    //     title: 'Hải Phòng',
    //     src: '/bat-dong-san-hai-phong.webp',
    //     href: '/hai-phong',
    // },
];
