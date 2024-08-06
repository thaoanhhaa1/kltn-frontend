import { IPayloadJWT } from '@/interfaces/jwt';
import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';

const DashboardPage = () => {
    const cookiesStore = cookies();
    const accessToken = cookiesStore.get('accessToken')?.value;
    const refreshToken = cookiesStore.get('refreshToken')?.value;

    if (!accessToken || !refreshToken) {
        return <div>Unauthorized</div>;
    }

    try {
        const payload: IPayloadJWT = jwtDecode(accessToken);

        if (!payload.userTypes.includes('admin')) {
            return <div>Forbidden </div>;
        }
    } catch (error) {
        return <div>Unauthorized</div>;
    }

    return <div>Dashboard Page</div>;
};

export default DashboardPage;
