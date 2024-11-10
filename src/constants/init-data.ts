import { ITable } from '@/interfaces/table';

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

export const DEFAULT_SORT_PROPERTY = 'normal';
