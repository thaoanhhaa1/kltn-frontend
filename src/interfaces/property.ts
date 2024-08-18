import { IAttribute } from '@/interfaces/attribute';
import { IUser } from '@/interfaces/user';

export type PropertyStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'UNAVAILABLE';
export interface ICondition {
    condition_type: string;
    condition_value: string;
}

export interface IProperty {
    property_id: string;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
    deposit: number;
    min_duration: number;
    deleted: boolean;
    slug: string;
    status: PropertyStatus;
    address: {
        street: string;
        city: string;
        district: string;
        ward: string;
    };
    attributes: Array<IAttribute>;
    images: Array<string>;
    conditions: Array<ICondition>;
    prices: number;
    owner: Pick<IUser, 'user_id' | 'name' | 'phone_number' | 'avatar' | 'email'>;
}