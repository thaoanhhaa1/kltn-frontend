import { IAttribute } from '@/interfaces/attribute';
import { IPagination } from '@/interfaces/pagination';
import { IPropertyType } from '@/interfaces/property-type';
import { IUser } from '@/interfaces/user';

export type PropertyStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'UNAVAILABLE' | 'REJECTED';
export type ApprovalStatus = Extract<PropertyStatus, 'ACTIVE' | 'REJECTED'>;
export type VisibleStatus = Extract<PropertyStatus, 'ACTIVE' | 'INACTIVE'>;

export interface IAddress {
    street: string;
    city: string;
    district: string;
    ward: string;
}
export interface ICondition {
    type: string;
    value: string;
}

export interface IProperty {
    propertyId: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    deposit: number;
    minDuration: number;
    deleted: boolean;
    slug: string;
    status: PropertyStatus;
    address: IAddress;
    attributes: Array<IAttribute>;
    images: Array<string>;
    rentalConditions: Array<ICondition>;
    price: number;
    type: IPropertyType;
    owner: Pick<IUser, 'userId' | 'name' | 'phoneNumber' | 'avatar' | 'email'>;
    rating: number;
    ratingCount: number;
    isFavorite: boolean;
    longitude?: number;
    latitude?: number;
}

export type IFiterProperty = {
    title?: IProperty['title'];
    depositFrom?: IProperty['deposit'];
    depositTo?: IProperty['deposit'];
    priceFrom?: IProperty['price'];
    priceTo?: IProperty['price'];
    status?: IProperty['status'];
    city?: IProperty['address']['city'];
    district?: IProperty['address']['district'];
    ward?: IProperty['address']['ward'];
};

export type IAdminFilterProperty = IFiterProperty & {
    ownerId?: IUser['userId'];
};

export interface ICountAvailableProperties {
    data: number;
    status: number;
    success: boolean;
}

export type IGetNotDeletedProperties = IPagination & {
    propertyId?: IProperty['propertyId'];
    title?: IProperty['title'];
    ward?: IAddress['ward'];
    district?: IAddress['district'];
    city?: IAddress['city'];
    ownerId?: IUser['userId'];
    ownerName?: IUser['name'];
    status?: IProperty['status'];
};
