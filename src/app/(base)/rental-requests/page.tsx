import Header from '@/app/(base)/rental-requests/header';
import RentalRequest from '@/app/(base)/rental-requests/rental-request';
import Forbidden from '@/components/forbidden';
import { initDataTable } from '@/constants/init-data';
import { IPayloadJWT } from '@/interfaces/jwt';
import { IRentalRequest } from '@/interfaces/rentalRequest';
import { ITable } from '@/interfaces/table';
import { renterGetAllRentalRequests } from '@/services/rental-request-service';
import { Col, Empty, Row } from 'antd';
import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';

const RentalRequestPage = async () => {
    const cookiesStore = cookies();
    const accessToken = cookiesStore.get('accessToken')?.value || '';
    let rentalRequests: ITable<IRentalRequest> = initDataTable;

    if (!accessToken) return <Forbidden />;

    try {
        const payload: IPayloadJWT = jwtDecode(accessToken);

        if (!payload.userTypes.includes('renter')) {
            return <Forbidden />;
        }
    } catch (error) {
        return <div>Unauthorized</div>;
    }

    try {
        rentalRequests = await renterGetAllRentalRequests(accessToken);
    } catch (error) {}

    return (
        <div className="mt-5 pb-5">
            <Header />
            <Row gutter={[12, 12]}>
                {rentalRequests.data.map((rentalRequest) => (
                    <Col span={12} key={rentalRequest.requestId}>
                        <RentalRequest rentalRequest={rentalRequest} />
                    </Col>
                ))}
            </Row>
            {rentalRequests.pageInfo.total === 0 && <Empty description="Chưa có yêu cầu thuê nhà nào." />}
        </div>
    );
};

export default RentalRequestPage;
