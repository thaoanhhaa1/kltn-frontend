import { HeaderDictionary, ModeDictionary } from '@/app/[lang]/dictionaries';
import SignOut from '@/components/header/sign-out';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { IUser } from '@/interfaces/user';
import { SIGN_IN, SIGN_UP } from '@/path';
import { CircleUser, Search } from 'lucide-react';
import Link from 'next/link';

const HeaderRight = ({
    headerDict,
    modeDict,
    user,
    params: { lang },
}: {
    modeDict: ModeDictionary;
    headerDict: HeaderDictionary;
    user?: IUser;
    params: {
        lang: string;
    };
}) => {
    return (
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <form className="ml-auto flex-1 sm:flex-initial">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={headerDict['search-placeholder']}
                        className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                    />
                </div>
            </form>
            <ModeToggle modeDict={modeDict} />
            {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="rounded-full">
                            <CircleUser className="h-5 w-5" />
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{headerDict['my-account']}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>{headerDict.settings}</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <SignOut>{headerDict.logout}</SignOut>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <>
                    <Button variant="outline" asChild>
                        <Link href={`${lang}${SIGN_UP}`}>{headerDict['sign-up']}</Link>
                    </Button>
                    <Button asChild>
                        <Link href={`${lang}${SIGN_IN}`}>{headerDict['sign-in']}</Link>
                    </Button>
                </>
            )}
        </div>
    );
};

export default HeaderRight;
