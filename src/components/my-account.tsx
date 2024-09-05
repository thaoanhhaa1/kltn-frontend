'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { OWNER as OWNER_ROLE, RENTER } from '@/constants/account-type';
import { IUser } from '@/interfaces/user';
import http from '@/lib/http';
import { getNameAvatar } from '@/lib/utils';
import { OWNER, OWNER_PROPERTIES, PROFILE, SIGN_IN, WALLET } from '@/path';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

const MyAccount = ({ user }: { user: IUser }) => {
    const router = useRouter();

    const ownerMenu = useMemo(
        () => [
            {
                title: 'Tổng quan',
                onClick: () => router.push(OWNER),
            },
            {
                title: 'Bất động sản',
                onClick: () => router.push(OWNER_PROPERTIES),
            },
        ],
        [router],
    );

    const authMenu = useMemo(() => {
        const menu = [
            {
                title: 'Thông tin cá nhân',
                onClick: () => router.push(PROFILE),
            },
        ];

        if (user.user_types.includes(RENTER) || user.user_types.includes(OWNER_ROLE))
            menu.push({
                title: 'Ví',
                onClick: () => router.push(WALLET),
            });

        return menu;
    }, [router, user.user_types]);

    const handleLogout = async () => {
        try {
            await http.post('/api/auth/sign-out', null, {
                baseUrl: '',
            });

            router.push(SIGN_IN);
        } catch (error) {
            console.error('Error signing out', error);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                    <Avatar>
                        <AvatarImage src={user.avatar || ''} className="object-cover" />
                        <AvatarFallback>{getNameAvatar(user.name)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                {user.user_types.includes('owner') && (
                    <>
                        <DropdownMenuSeparator />
                        {ownerMenu.map((item) => (
                            <DropdownMenuItem key={item.title} onClick={item.onClick}>
                                {item.title}
                            </DropdownMenuItem>
                        ))}
                    </>
                )}
                <DropdownMenuSeparator />
                {authMenu.map((item) => (
                    <DropdownMenuItem key={item.title} onClick={item.onClick}>
                        {item.title}
                    </DropdownMenuItem>
                ))}
                <DropdownMenuItem>Cài đặt</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Đăng xuất</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default MyAccount;
