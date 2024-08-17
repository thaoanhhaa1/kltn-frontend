'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import http from '@/lib/http';
import { SIGN_IN } from '@/path';
import { useParams, useRouter } from 'next/navigation';
import React, { ReactNode } from 'react';

const SignOut = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const { lang } = useParams();

    const handleSignOut = async () => {
        try {
            await http.post('/api/auth/sign-out', null, {
                baseUrl: '',
            });
        } catch (error) {
        } finally {
            router.push(`/${lang}${SIGN_IN}`);
        }
    };

    return <DropdownMenuItem onClick={handleSignOut}>{children}</DropdownMenuItem>;
};

export default SignOut;
