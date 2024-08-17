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
import { getNameAvatar } from '@/lib/utils';

const MyAccount = ({ headerDict, user }: { headerDict: HeaderDictionary; user: IUser }) => {
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
                <DropdownMenuSeparator />
                <DropdownMenuItem>{headerDict.settings}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>{headerDict.logout}</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default MyAccount;
