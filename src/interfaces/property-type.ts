export interface IPropertyType {
    id: string;
    name: string;
}

export interface IPropertyTypeDetail {
    id: string;
    name: string;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IGetPropertyTypeByAdmin {
    id?: string;
    name?: string;
}
