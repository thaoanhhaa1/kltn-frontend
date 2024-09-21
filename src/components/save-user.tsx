'use client';

import { IUser } from '@/interfaces/user';
import { useUserStore } from '@/stores/user-store';
import { useState } from 'react';

const SaveUser = ({ user }: { user?: IUser }) => {
    const { setUser } = useUserStore();
    useState(() => user && setUser(user));

    return null;
};

export default SaveUser;
