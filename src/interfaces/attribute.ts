export interface IAttribute {
    id: string;
    type: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    deleted: boolean;
}

export type IAttributeCbb = Pick<IAttribute, 'id' | 'name'>;

export type ICreateAttribute = Pick<IAttribute, 'type' | 'name'>;

export type IUpdateAttribute = Pick<IAttribute, 'id' | 'type' | 'name'>;
