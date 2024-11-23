import { IPropertyInteraction } from '@/interfaces/property-interaction';
import { create } from 'zustand';

export interface IFavoriteStore {
    isFirstLoad: boolean;
    count: number;
    favorites: IPropertyInteraction[];
    loading: boolean;
    increment: () => void;
    decrement: () => void;
    addFavorite: (favorite: IPropertyInteraction) => void;
    setLoading: (loading: boolean) => void;
    setCount: (count: number) => void;
    resetFavoriteStore: () => void;
}

const useFavoriteStore = create<IFavoriteStore>((set) => ({
    isFirstLoad: false,
    count: 0,
    favorites: [],
    loading: false,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
    addFavorite: (favorite) => set((state) => ({ favorites: [...state.favorites, favorite] })),
    setLoading: (loading) => set({ loading }),
    setCount: (count) => set({ count }),
    resetFavoriteStore: () => set({ favorites: [], count: 0, loading: false, isFirstLoad: false }),
}));

export { useFavoriteStore };
