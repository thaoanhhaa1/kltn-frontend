import { IAttribute } from '@/interfaces/attribute';

export const types = {
    Amenity: 'Tiện ích',
    Highlight: 'Nổi bật',
    Facility: 'Tiện nghi',
};

export const initAttribute: IAttribute = {
    deleted: false,
    id: '',
    name: '',
    type: '',
    createdAt: '',
    updatedAt: '',
};
