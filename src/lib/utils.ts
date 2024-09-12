import { IPagination } from '@/interfaces/pagination';
import { PropertyStatus } from '@/interfaces/property';
import { RentalRequestStatus } from '@/interfaces/rentalRequest';
import { Role } from '@/types/role';
import { UserStatus } from '@/types/user-status';
import { type ClassValue, clsx } from 'clsx';
import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getNameAvatar = (name: string) => {
    const splitName = name.split(' ');
    const length = splitName.length;

    return `${splitName[0][0]}${length > 1 ? splitName.at(-1)![0] : ''}`.toUpperCase();
};

export const getRoleColor = (role: Role) => {
    if (role === 'admin') return 'red';
    if (role === 'owner') return 'green';
    return 'blue';
};

export const getUserStatusColor = (userStatus: UserStatus) => {
    if (userStatus === 'ACTIVE') return 'success';
    if (userStatus === 'INACTIVE') return 'processing';
    if (userStatus === 'BLOCKED') return 'red';
    return 'error';
};

export const getPropertyStatusColor = (propertyStatus: PropertyStatus) => {
    if (propertyStatus === 'ACTIVE') return 'success';
    if (propertyStatus === 'INACTIVE') return 'warning';
    if (propertyStatus === 'UNAVAILABLE') return 'purple';
    if (propertyStatus === 'REJECTED') return 'error';
    return 'processing';
};

export const getRentalRequestColor = (status: RentalRequestStatus) => {
    if (status === 'PENDING') return 'processing';
    if (status === 'APPROVED') return 'success';
    if (status === 'REJECTED') return 'error';
    if (status === 'CANCELLED') return 'warning';
    return 'default';
};

export const formatDate = (date: string) => {
    return dayjs(date).format('DD/MM/YYYY');
};

export const formatDateTime = (dateTime: string) => {
    return dayjs(dateTime).format('HH:mm:ss DD/MM/YYYY');
};

export const formatCurrency = (value: number, showVND?: boolean) => {
    const formatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    if (showVND) return formatted;
    return formatted.slice(0, formatted.length - 2);
};

export const toSkipTake = (page: number, pageSize: number): IPagination => {
    return {
        skip: (page - 1) * pageSize,
        take: pageSize,
    };
};

export const convertObjectToParams = (obj: Record<string, any>) => {
    const newObj = Object.entries(obj).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') acc[key] = value;
        return acc;
    }, {} as Record<string, any>);

    return new URLSearchParams(newObj).toString();
};

export function convertCurrencyToText(number: number): string {
    const units: { value: number; text: string }[] = [
        { value: 10 ** 9, text: 'tỷ' },
        { value: 10 ** 6, text: 'triệu' },
        { value: 10 ** 3, text: 'nghìn' },
        { value: 1, text: '' },
    ];

    for (const unit of units) {
        if (number >= unit.value) {
            const convertedNumber = Math.floor(number / unit.value);
            return `${convertedNumber} ${unit.text}`.trim();
        }
    }

    return number.toString();
}

export const convertDateToTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime() + 7 * 60 * 60 * 1000;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) return `${years} năm trước`;
    if (months > 0) return `${months} tháng trước`;
    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    if (minutes > 0) return `${minutes} phút trước`;
    return `${seconds} giây trước`;
};
