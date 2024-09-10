import { ModeToggle } from '@/components/mode-toggle';
import MyAccount from '@/components/my-account';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IUser } from '@/interfaces/user';
import { ADD_PROPERTY, DASHBOARD, SIGN_IN, SIGN_UP } from '@/path';
import { Search } from 'lucide-react';
import Link from 'next/link';

const HeaderRight = ({ user }: { user?: IUser }) => {
    return (
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <form className="ml-auto flex-1 sm:flex-initial">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Tìm kiếm bất động sản..."
                        className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                    />
                </div>
            </form>
            <ModeToggle />
            {user?.userTypes.includes('admin') && (
                <Button variant="outline" asChild>
                    <Link href={DASHBOARD}>Dashboard</Link>
                </Button>
            )}
            {user?.userTypes.includes('owner') && (
                <Button variant="outline" asChild>
                    <Link href={ADD_PROPERTY}>Đăng tin</Link>
                </Button>
            )}
            {user ? (
                <MyAccount user={user} />
            ) : (
                <>
                    <Button variant="outline" asChild>
                        <Link href={SIGN_UP}>Đăng ký</Link>
                    </Button>
                    <Button asChild>
                        <Link href={SIGN_IN}>Đăng nhập</Link>
                    </Button>
                </>
            )}
        </div>
    );
};

export default HeaderRight;
