import { IPageInfo } from '@/interfaces/pagination';

export interface ITable<T> {
    data: T[];
    pageInfo: IPageInfo;
}
