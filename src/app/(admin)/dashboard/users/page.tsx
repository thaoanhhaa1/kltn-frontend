import UsersBreadcrumb from '@/app/(admin)/dashboard/users/user-breadcrumb';
import UsersTable from './users-table';

const UsersPage = async () => {
    return (
        <div>
            <UsersBreadcrumb />
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Người dùng</h2>
            <UsersTable />
        </div>
    );
};

export default UsersPage;
