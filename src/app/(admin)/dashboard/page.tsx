import CountPropertiesByDistrict from '@/app/(admin)/dashboard/count-properties-by-district';
import CountPropertiesByRevenue from '@/app/(admin)/dashboard/count-properties-by-revenue';
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
    getOverviewByAdmin,
} from '@/services/dashboard-service';
import { Col, Flex, Row } from 'antd';
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

    try {
        [
            overview,
            newUsersByTypeAndMonth,
            propertiesByType,
            propertiesByDistrict,
            rentalRequestByDay,
            rentalRequestByWeek,
            rentalRequestByMonth,
        ] = await Promise.all([
            getOverviewByAdmin(accessToken),
            countNewUsersByTypeAndMonth(accessToken),
            countPropertiesByType(accessToken),
            countPropertiesByDistrict(accessToken),
            countRentalRequestByDay(accessToken),
            countRentalRequestByWeek(accessToken),
            countRentalRequestByMonth(accessToken),
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
                <Item title="Số lượng người dùng mới theo loại và tháng">
                    <NewUsersByTypeAndMonth data={newUsersByTypeAndMonth} />
                </Item>
                <Row gutter={16}>
                    <Col span={12}>
                        <Item title="Số lượng bất động sản theo loại">
                            <CountPropertiesByType config={config} chartData={chartData} />
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item title="Giá thuê trung bình theo loại">
                            <CountPropertiesByRevenue config={config} chartData={chartData} />
                        </Item>
                    </Col>
                </Row>
                <Item title="Số lượng bất động sản theo khu vực">
                    <CountPropertiesByDistrict data={propertiesByDistrict} />
                </Item>
                {/* CountRentalRequest */}
                <Item title="Số lượng yêu cầu thuê">
                    <CountRentalRequest
                        dayData={rentalRequestByDay}
                        weekData={rentalRequestByWeek}
                        monthData={rentalRequestByMonth}
                    />
                </Item>
            </Flex>
        </div>
    );
};

export default DashboardPage;
