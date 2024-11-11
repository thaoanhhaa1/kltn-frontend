import OverviewItem from '@/components/overview/overview-item';
import { IOverviewByAdminRes } from '@/interfaces/dashboard';
import { formatCurrency, getPropertyStatusText } from '@/lib/utils';

const Overview = ({ overview }: { overview: IOverviewByAdminRes }) => {
    const [firstUserByType, secondUserByType] = overview.usersByType;

    return (
        <div className="grid grid-cols-4 gap-4">
            <OverviewItem title="Chủ nhà" value={firstUserByType.count} />
            <OverviewItem title="Người thuê" value={secondUserByType.count} />
            <OverviewItem title="Người dùng mới" value={overview.newUsersInMonth} />
            <OverviewItem title="Tổng số giao dịch" value={overview.transactionStats.count} />
            <OverviewItem title="Tổng doanh thu" value={formatCurrency(overview.transactionStats.revenue, true)} />
            {overview.propertiesByStatus.map((item) => (
                <OverviewItem
                    key={item.status}
                    title={`Bất động sản ${getPropertyStatusText(item.status)}`}
                    value={item.count}
                />
            ))}
            <OverviewItem title="Giá thuê trung bình" value={formatCurrency(overview.avgPrice, true)} />
            <OverviewItem title="Hợp đồng đang chờ xác nhận" value={overview.contractByStatus.WAITING} />
            <OverviewItem title="Hợp đồng đang cho thuê" value={overview.contractByStatus.ONGOING} />
            <OverviewItem title="Hợp đồng đã kết thúc" value={overview.contractByStatus.ENDED} />
            <OverviewItem
                title="Yêu cầu thuê nhà"
                value={overview.rentalRequestByStatus.APPROVED + overview.rentalRequestByStatus.REJECTED}
            />
        </div>
    );
};

export default Overview;
