import UserForm from '@/app/(base)/user/user-form';
import { IUser } from '@/interfaces/user';
import { SIGN_IN } from '@/path';
import { getMe } from '@/services/user-service';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const UserPage = async () => {
    let user: IUser | undefined;

    try {
        const cookiesStore = cookies();
        const accessToken = cookiesStore.get('accessToken')?.value || '';

        user = await getMe(accessToken);
    } catch (error) {}

    if (!user) return redirect(SIGN_IN);

    return (
        <div>
            <UserForm user={user} />
        </div>
    );
};

export default UserPage;
