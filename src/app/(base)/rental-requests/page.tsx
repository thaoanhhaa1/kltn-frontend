import Header from '@/app/(base)/rental-requests/header';
import RentalRequest from '@/app/(base)/rental-requests/rental-request';
import { IRentalRequest } from '@/interfaces/rentalRequest';
import { renterGetAllRentalRequests } from '@/services/rental-request-service';
import { Col, Empty, Row } from 'antd';
import { cookies } from 'next/headers';

const RentalRequestPage = async () => {
    const cookiesStore = cookies();
    const accessToken = cookiesStore.get('accessToken')?.value || '';
    let rentalRequests: Array<IRentalRequest> = [];

    try {
        rentalRequests = await renterGetAllRentalRequests(accessToken);
    } catch (error) {}

    return (
        <div className="mt-5">
            <Header />
            <Row>
                {rentalRequests.map((rentalRequest) => (
                    <Col span={12} key={rentalRequest.requestId}>
                        <RentalRequest rentalRequest={rentalRequest} />
                    </Col>
                ))}
            </Row>
            {rentalRequests.length === 0 && <Empty description="Chưa có yêu cầu thuê nhà nào." />}
        </div>
    );
};

export default RentalRequestPage;
