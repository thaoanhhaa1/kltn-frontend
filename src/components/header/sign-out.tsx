'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import http from '@/lib/http';
import { SIGN_IN } from '@/path';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

const SignOut = ({ children }: { children: ReactNode }) => {
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await http.post('/api/auth/sign-out', null, {
                baseUrl: '',
            });
        } catch (error) {
        } finally {
            router.push(SIGN_IN);
        }
    };

    return <DropdownMenuItem onClick={handleSignOut}>{children}</DropdownMenuItem>;
};

export default SignOut;
