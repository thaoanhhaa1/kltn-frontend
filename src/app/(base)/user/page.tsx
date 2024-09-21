import UpdatePassword from '@/app/(base)/user/update-password';
import UserForm from '@/app/(base)/user/user-form';
import VerifyForm from '@/app/(base)/user/verify-form';
import SaveUser from '@/components/save-user';
import { IUser } from '@/interfaces/user';
import { SIGN_IN } from '@/path';
import { getMe } from '@/services/user-service';
import { Tabs, TabsProps } from 'antd';
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

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Chỉnh sửa thông tin',
            children: <UserForm user={user} />,
        },
        {
            key: '2',
            label: 'Đổi mật khẩu',
            children: <UpdatePassword />,
        },
        {
            key: '3',
            label: 'Xác thực tài khoản',
            children: <VerifyForm />,
        },
    ];

    return (
        <div className="mt-6">
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
                Quản lý tài khoản
            </h2>
            <Tabs defaultActiveKey="1" items={items} />
            <SaveUser user={user} />
        </div>
    );
};

export default UserPage;
