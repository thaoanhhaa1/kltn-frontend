'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { SIGN_IN } from '@/path';
import { signOut } from '@/services/auth-service';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

const SignOut = ({ children }: { children: ReactNode }) => {
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
        } finally {
            router.push(SIGN_IN);
        }
    };

    return <DropdownMenuItem onClick={handleSignOut}>{children}</DropdownMenuItem>;
};

export default SignOut;
