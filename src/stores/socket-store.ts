import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

export interface ISocketStore {
    socket: Socket | null;
    connect: () => void;
    disconnect: () => void;
}

const useSocketStore = create<ISocketStore>((set) => ({
    socket: null,
    connect: () =>
        set({
            socket: io('http://localhost:4001'),
        }),
    disconnect: () => set({ socket: null }),
}));

export { useSocketStore };
