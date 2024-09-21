import { IUser } from '@/interfaces/user';
import { create } from 'zustand';

export interface IUserStore {
    user?: IUser;
    setUser: (user: IUser) => void;
}

const useUserStore = create<IUserStore>((set) => ({
    user: undefined,
    setUser: (user: IUser) => set({ user }),
}));

export { useUserStore };
