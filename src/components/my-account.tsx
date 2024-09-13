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
import { getNameAvatar } from '@/lib/utils';
import { OWNER, OWNER_PROPERTIES, PROFILE, RENTAL_REQUESTS, SIGN_IN, WALLET } from '@/path';
import { signOut } from '@/services/auth-service';
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

    const renterMenu = useMemo(
        () => [
            {
                title: 'Yêu cầu thuê nhà',
                onClick: () => {
                    router.push(RENTAL_REQUESTS);
                    router.refresh();
                },
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

        if (user.userTypes.includes(RENTER) || user.userTypes.includes(OWNER_ROLE))
            menu.push({
                title: 'Ví',
                onClick: () => router.push(WALLET),
            });

        return menu;
    }, [router, user.userTypes]);

    const handleLogout = async () => {
        try {
            await signOut();

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
                {user.userTypes.includes('owner') && (
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
                {user.userTypes.includes('renter')
                    ? renterMenu.map((item) => (
                          <DropdownMenuItem key={item.title} onClick={item.onClick}>
                              {item.title}
                          </DropdownMenuItem>
                      ))
                    : null}
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
