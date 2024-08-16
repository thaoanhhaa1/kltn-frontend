import UsersBreadcrumb from '@/app/[lang]/(admin)/dashboard/users/user-breadcrumb';
import UsersTable from './users-table';
import { getDictionary } from '@/app/[lang]/dictionaries';

const UsersPage = async ({
    params: { lang },
}: {
    params: {
        lang: string;
    };
}) => {
    const dict = await getDictionary(lang);
    const userDashboardDict = dict['user-dashboard'];
    const sidebarDict = dict['sidebar'];

    return (
        <div>
            <UsersBreadcrumb sidebarDict={sidebarDict} />
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Users</h2>
            <UsersTable userDashboardDict={userDashboardDict} />
        </div>
    );
};

export default UsersPage;
