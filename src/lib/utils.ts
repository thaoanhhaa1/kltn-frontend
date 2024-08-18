import { IPagination } from '@/interfaces/pagination';
import { PropertyStatus } from '@/interfaces/property';
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
    if (propertyStatus === 'UNAVAILABLE') return 'error';
    return 'processing';
};

export const formatDateTime = (dateTime: string) => {
    return dayjs(dateTime).format('HH:mm:ss DD/MM/YYYY');
};

export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export const toSkipTake = (page: number, pageSize: number): IPagination => {
    return {
        skip: (page - 1) * pageSize,
        take: pageSize,
    };
};