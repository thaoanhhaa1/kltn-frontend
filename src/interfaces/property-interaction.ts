import { IProperty } from '@/interfaces/property';

export type PropertyInteractionType = 'VIEWED' | 'FAVORITED';

export interface IPropertyInteraction {
    interactionId: string;
    userId: string;
    interactionType: PropertyInteractionType;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    property: IProperty;
}

export interface ICreatePropertyInteraction {
    propertyId: string;
    interactionType: PropertyInteractionType;
}

export interface IUpdatePropertyInteraction {
    interactionId: string;
    interactionType: PropertyInteractionType;
}

export interface IDeletePropertyInteraction {
    interactionId: string;
}
