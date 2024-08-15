import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getNameAvatar = (name: string) => {
    const splitName = name.split(' ');
    const length = splitName.length;

    return `${splitName[0][0]}${length > 1 ? splitName.at(-1)![0] : ''}`.toUpperCase();
};
