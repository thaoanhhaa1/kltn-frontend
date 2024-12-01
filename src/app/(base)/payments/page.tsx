import Header from '@/app/(base)/payments/header';
import Payments from '@/app/(base)/payments/payments';
import Forbidden from '@/components/forbidden';
import { IPayloadJWT } from '@/interfaces/jwt';
import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';

const PaymentsPage = async () => {
    const cookiesStore = cookies();
    const accessToken = cookiesStore.get('accessToken')?.value;

    if (!accessToken) return <Forbidden />;

    try {
        const payload: IPayloadJWT = jwtDecode(accessToken);

        if (!payload.userTypes.includes('renter')) {
            return <Forbidden />;
        }
    } catch (error) {
        return <Forbidden />;
    }

    return (
        <div className="mt-5 pb-5">
            <Header />
            <Payments />
        </div>
    );
};

export default PaymentsPage;
