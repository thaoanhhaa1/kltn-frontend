import ContractCancelRate from '@/app/owner/contract-cancel-rate';
import IncomeExpenditure from '@/app/owner/income-expenditure';
import Item from '@/app/owner/item';
import OwnerBreadcrumb from '@/app/owner/owner-breadcrumb';
import RentalRequestRating from '@/app/owner/rental-request-rating';
import TenantDistribution from '@/app/owner/tenant-distribution';
import Overview from '@/components/overview/overview';
import {
    IGetContractCancellationRateByOwner,
    IGetRentalRequestRatingByOwner,
    IGetTenantDistributionByOwner,
    IIncomeExpenditure,
    IOverviewByOwnerRes,
} from '@/interfaces/dashboard';
import {
    getContractCancellationRateByOwner,
    getIncomeExpenditureByOwner,
    getOverviewByOwner,
    getRentalRequestRatingByOwner,
    getTenantDistributionByOwner,
} from '@/services/dashboard-service';
import { Col, Flex, Row } from 'antd';
import { cookies } from 'next/headers';

const OwnerPage = async () => {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    let overview: IOverviewByOwnerRes | null = null;
    let incomeExpenditure: IIncomeExpenditure[] = [];
    let cancelRate: Array<IGetContractCancellationRateByOwner> = [];
    let rentalRequestRating: Array<IGetRentalRequestRatingByOwner> = [];
    let tenantDistribution: Array<IGetTenantDistributionByOwner> = [];
    const year = new Date().getFullYear();

    try {
        [overview, incomeExpenditure, cancelRate, rentalRequestRating, tenantDistribution] = await Promise.all([
            getOverviewByOwner(accessToken!),
            getIncomeExpenditureByOwner(accessToken!),
            getContractCancellationRateByOwner(accessToken!),
            getRentalRequestRatingByOwner(accessToken!),
            getTenantDistributionByOwner(accessToken!),
        ]);
    } catch (error) {
        console.log(error);
    }

    console.log('🚀 ~ OwnerPage ~ overview:', overview);
    console.log('🚀 ~ OwnerPage ~ incomeExpenditure:', incomeExpenditure);
    console.log('🚀 ~ OwnerPage ~ cancelRate:', cancelRate);
    console.log('🚀 ~ OwnerPage ~ rentalRequestRating:', rentalRequestRating);
    console.log('🚀 ~ OwnerPage ~ tenantDistribution:', tenantDistribution);

    return (
        <div>
            <OwnerBreadcrumb />
            <Flex vertical gap={40}>
                {overview && (
                    <Item title="Tóm tắt">
                        <Overview overview={overview} />
                    </Item>
                )}
                <Item title={`Biến động thu nhập theo tháng/${year}`}>
                    <IncomeExpenditure incomeExpenditures={incomeExpenditure} />
                </Item>
                <Item title="Yêu cầu thuê nhà">
                    <RentalRequestRating data={rentalRequestRating} cancelRate={cancelRate} />
                </Item>
                {/* <Row gutter={16}>
                    <Col span={12}>
                        <Item title="Tỷ lệ huỷ hợp đồng">
                            <ContractCancelRate data={cancelRate} />
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item title="Phân phối khách thuê theo khu vực">
                            <TenantDistribution data={tenantDistribution} />
                        </Item>
                    </Col>
                </Row> */}
            </Flex>
        </div>
    );
};

export default OwnerPage;
