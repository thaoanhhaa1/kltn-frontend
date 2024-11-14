import CountPropertiesByType, { ICountPropertyByTypeChart } from '@/app/(admin)/dashboard/count-properties-by-type';
import CountRentalRequest from '@/app/(admin)/dashboard/count-rental-requests';
import DashboardBreadcrumb from '@/app/(admin)/dashboard/dashboard-breadcrumb';
import NewUsersByTypeAndMonth from '@/app/(admin)/dashboard/new-users-by-type-month';
import Overview from '@/app/(admin)/dashboard/overview';
import Item from '@/app/owner/item';
import Forbidden from '@/components/forbidden';
import { ChartConfig } from '@/components/ui/chart';
import {
    ICountNewUserByTypeAndMonth,
    ICountPropertyByDistrict,
    ICountPropertyByType,
    ICountRentalRequestByDay,
    ICountRentalRequestByMonth,
    ICountRentalRequestByWeek,
    ICountTransactionsByStatusAndMonth,
    IGetRevenueAndFeeByMonth,
    IOverviewByAdminRes,
} from '@/interfaces/dashboard';
import { getRandomColor } from '@/lib/utils';
import {
    countNewUsersByTypeAndMonth,
    countPropertiesByDistrict,
    countPropertiesByType,
    countRentalRequestByDay,
    countRentalRequestByMonth,
    countRentalRequestByWeek,
    countTransactionsByStatusAndMonth,
    getOverviewByAdmin,
    getRevenueAndFeeByMonth,
} from '@/services/dashboard-service';
import { Flex } from 'antd';
import { cookies } from 'next/headers';

const getPropertiesByTypeData = (
    data: Array<ICountPropertyByType>,
): [ChartConfig, Array<ICountPropertyByTypeChart>] => {
    const config: ChartConfig = {};
    const chartData = data.map((item) => {
        const color = getRandomColor();

        config[item.type] = {
            label: item.type,
            color,
        };

        return {
            ...item,
            fill: color,
        };
    });
    return [config, chartData];
};

const DashboardPage = async () => {
    const cookiesStore = cookies();
    const accessToken = cookiesStore.get('accessToken')!.value;
    let overview: IOverviewByAdminRes | null = null;
    let newUsersByTypeAndMonth: Array<ICountNewUserByTypeAndMonth> = [];
    let propertiesByType: Array<ICountPropertyByType> = [];
    let propertiesByDistrict: Array<ICountPropertyByDistrict> = [];
    let rentalRequestByDay: Array<ICountRentalRequestByDay> = [];
    let rentalRequestByWeek: Array<ICountRentalRequestByWeek> = [];
    let rentalRequestByMonth: Array<ICountRentalRequestByMonth> = [];
    let revenueAndFeeByMonth: Array<IGetRevenueAndFeeByMonth> = [];
    let transactionsByStatusAndMonth: Array<ICountTransactionsByStatusAndMonth> = [];

    try {
        [
            overview,
            newUsersByTypeAndMonth,
            propertiesByType,
            propertiesByDistrict,
            rentalRequestByDay,
            rentalRequestByWeek,
            rentalRequestByMonth,
            revenueAndFeeByMonth,
            transactionsByStatusAndMonth,
        ] = await Promise.all([
            getOverviewByAdmin(accessToken),
            countNewUsersByTypeAndMonth(accessToken),
            countPropertiesByType(accessToken),
            countPropertiesByDistrict(accessToken),
            countRentalRequestByDay(accessToken),
            countRentalRequestByWeek(accessToken),
            countRentalRequestByMonth(accessToken),
            getRevenueAndFeeByMonth(accessToken),
            countTransactionsByStatusAndMonth(accessToken),
        ]);
    } catch (error) {
        console.log('🚀 ~ DashboardPage ~ error:', error);
        return <Forbidden />;
    }

    const [config, chartData] = getPropertiesByTypeData(propertiesByType);

    return (
        <div>
            <DashboardBreadcrumb />
            <Flex vertical gap={40}>
                {overview && (
                    <Item title="Tóm tắt">
                        <Overview overview={overview} />
                    </Item>
                )}
                {/* NewUsersByTypeAndMonth */}
                <Item title="Số lượng người dùng theo tháng">
                    <NewUsersByTypeAndMonth data={newUsersByTypeAndMonth} />
                </Item>
                <Item title="Số lượng bất động sản theo loại">
                    <CountPropertiesByType config={config} chartData={chartData} />
                </Item>
                {/* <Col span={12}>
                        <Item title="Giá thuê trung bình theo loại">
                            <CountPropertiesByRevenue config={config} chartData={chartData} />
                        </Item>
                    </Col> */}
                {/* <Item title="Số lượng bất động sản theo khu vực">
                    <CountPropertiesByDistrict data={propertiesByDistrict} />
                </Item> */}
                {/* CountRentalRequest */}
                <Item title="Số lượng yêu cầu thuê">
                    <CountRentalRequest
                        dayData={rentalRequestByDay}
                        weekData={rentalRequestByWeek}
                        monthData={rentalRequestByMonth}
                    />
                </Item>
                {/* countTransactionsByStatusAndMonth */}
                {/* <Item title="Số lượng giao dịch theo trạng thái và tháng">
                    <CountTransactionsByStatusAndMonth data={transactionsByStatusAndMonth} />
                </Item>
                <Item title="Doanh thu và phí">
                    <RevenueAndFee data={revenueAndFeeByMonth} />
                </Item> */}
            </Flex>
        </div>
    );
};

export default DashboardPage;
