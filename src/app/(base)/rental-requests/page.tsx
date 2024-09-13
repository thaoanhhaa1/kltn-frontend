import Header from '@/app/(base)/rental-requests/header';
import RentalRequest from '@/app/(base)/rental-requests/rental-request';
import { initDataTable } from '@/constants/init-data';
import { IRentalRequest } from '@/interfaces/rentalRequest';
import { ITable } from '@/interfaces/table';
import { renterGetAllRentalRequests } from '@/services/rental-request-service';
import { Col, Empty, Row } from 'antd';
import { cookies } from 'next/headers';

const RentalRequestPage = async () => {
    const cookiesStore = cookies();
    const accessToken = cookiesStore.get('accessToken')?.value || '';
    let rentalRequests: ITable<IRentalRequest> = initDataTable;

    try {
        rentalRequests = await renterGetAllRentalRequests(accessToken);
    } catch (error) {}

    return (
        <div className="mt-5">
            <Header />
            <Row>
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
