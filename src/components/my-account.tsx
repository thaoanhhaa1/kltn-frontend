'use client';

import { HeaderDictionary } from '@/app/[lang]/dictionaries';
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
import { IUser } from '@/interfaces/user';
import http from '@/lib/http';
import { getNameAvatar } from '@/lib/utils';
import { OWNER, OWNER_PROPERTIES, SIGN_IN } from '@/path';
import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';

const MyAccount = ({ headerDict, user }: { headerDict: HeaderDictionary; user: IUser }) => {
    const router = useRouter();
    const { lang } = useParams();

    const ownerMenu = useMemo(
        () => [
            {
                title: headerDict.overview,
                onClick: () => router.push(`/${lang}${OWNER}`),
            },
            {
                title: headerDict.properties,
                onClick: () => router.push(`/${lang}${OWNER_PROPERTIES}`),
            },
        ],
        [headerDict, lang, router],
    );

    const handleLogout = async () => {
        try {
            await http.post('/api/auth/sign-out', null, {
                baseUrl: '',
            });

            router.push(`/${lang}${SIGN_IN}`);
        } catch (error) {
            console.error('Error signing out', error);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                    <Avatar>
                        <AvatarImage src={user.avatar || ''} />
                        <AvatarFallback>{getNameAvatar(user.name)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{headerDict['my-account']}</DropdownMenuLabel>
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
                <DropdownMenuItem>{headerDict.settings}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>{headerDict.logout}</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default MyAccount;
