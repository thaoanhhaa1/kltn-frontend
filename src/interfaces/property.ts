import { IAttribute } from '@/interfaces/attribute';
import { IUser } from '@/interfaces/user';

export type PropertyStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'UNAVAILABLE' | 'REJECTED';
export type ApprovalStatus = Extract<PropertyStatus, 'ACTIVE' | 'REJECTED'>;
export type VisibleStatus = Extract<PropertyStatus, 'ACTIVE' | 'INACTIVE'>;

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

export type IFiterProperty = {
    title?: IProperty['title'];
    deposit_from?: IProperty['deposit'];
    deposit_to?: IProperty['deposit'];
    price_from?: IProperty['prices'];
    price_to?: IProperty['prices'];
    status?: IProperty['status'];
    city?: IProperty['address']['city'];
    district?: IProperty['address']['district'];
    ward?: IProperty['address']['ward'];
};

export interface ICountAvailableProperties {
    data: number;
    status: number;
    success: boolean;
}
