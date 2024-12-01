import Contracts from '@/app/(base)/contracts/contracts';
import Forbidden from '@/components/forbidden';
import Title from '@/components/title';
import { IPayloadJWT } from '@/interfaces/jwt';
import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';

const ContractsPage = () => {
    const cookiesStore = cookies();
    const accessToken = cookiesStore.get('accessToken')?.value;

    try {
        const payload: IPayloadJWT = jwtDecode(accessToken!);

        if (!payload.userTypes.includes('renter')) return <Forbidden />;
    } catch (error) {
        return <Forbidden />;
    }

    return (
        <div className="mt-5">
            <Title
                style={{
                    textAlign: 'center',
                }}
                level={3}
            >
                Hợp đồng của tôi
            </Title>
            <Contracts />
        </div>
    );
};

export default ContractsPage;
