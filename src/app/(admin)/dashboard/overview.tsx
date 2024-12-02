import OverviewItem from '@/components/overview/overview-item';
import { IOverviewByAdminRes } from '@/interfaces/dashboard';
import { formatCurrency, getPropertyStatusText } from '@/lib/utils';

const Overview = ({ overview }: { overview: IOverviewByAdminRes }) => {
    const [firstUserByType, secondUserByType] = overview.usersByType;

    const pendingItem = overview.propertiesByStatus.find((item) => item.status === 'PENDING');
    const activeItem = overview.propertiesByStatus.find((item) => item.status === 'ACTIVE');
    const rejectedItem = overview.propertiesByStatus.find((item) => item.status === 'REJECTED');
    const unavailableItem = overview.propertiesByStatus.find((item) => item.status === 'UNAVAILABLE');

    if (activeItem?.count) activeItem.count += unavailableItem?.count || 0;

    const data = [pendingItem, activeItem, rejectedItem];

    return (
        <div className="grid grid-cols-4 gap-4">
            <OverviewItem title="Chủ nhà" value={firstUserByType.count} />
            <OverviewItem title="Người thuê" value={secondUserByType.count} />
            {/* <OverviewItem title="Người dùng mới" value={overview.newUsersInMonth} /> */}
            <OverviewItem title="Tổng số giao dịch" value={overview.transactionStats.count} />
            <OverviewItem title="Tổng doanh thu" value={formatCurrency(overview.transactionStats.revenue, true)} />

            {data
                .filter((item) => item?.status)
                .map((item) => (
                    <OverviewItem
                        key={item!.status}
                        title={'B' + `ất động sản ${getPropertyStatusText(item!.status)}`.toLowerCase()}
                        value={item!.count}
                    />
                ))}
            {/* <OverviewItem title="Giá thuê trung bình" value={formatCurrency(overview.avgPrice, true)} /> */}
            {/* <OverviewItem title="Hợp đồng đang chờ xác nhận" value={overview.contractByStatus.WAITING} />
            <OverviewItem title="Hợp đồng đang cho thuê" value={overview.contractByStatus.ONGOING} />
            <OverviewItem title="Hợp đồng đã kết thúc" value={overview.contractByStatus.ENDED} /> */}
            <OverviewItem
                title="Yêu cầu thuê nhà"
                value={(overview.rentalRequestByStatus.APPROVED ?? 0) + (overview.rentalRequestByStatus.REJECTED ?? 0)}
            />
        </div>
    );
};

export default Overview;
