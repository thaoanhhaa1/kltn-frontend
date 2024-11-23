import { envConfig } from '@/config/envConfig';
import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

export interface ISocketStore {
    socket: Socket | null;
    connect: () => void;
    disconnect: () => void;
    resetSocketStore: () => void;
}

const useSocketStore = create<ISocketStore>((set) => ({
    socket: null,
    connect: () =>
        set({
            socket: io(envConfig.NEXT_PUBLIC_SOCKET_ENDPOINT),
        }),
    disconnect: () => set({ socket: null }),
    resetSocketStore: () => set({ socket: null }),
}));

export { useSocketStore };
