'use client';

import { IUser } from '@/interfaces/user';
import { useUserStore } from '@/stores/user-store';
import { useEffect } from 'react';

const SaveUser = ({ user }: { user?: IUser }) => {
    const { setUser } = useUserStore();

    useEffect(() => {
        if (user) setUser(user);
    }, [setUser, user]);

    return null;
};

export default SaveUser;
