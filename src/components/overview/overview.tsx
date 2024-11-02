import OverviewItem from '@/components/overview/overview-item';
import { IOverviewByOwnerRes } from '@/interfaces/dashboard';
import { formatCurrency } from '@/lib/utils';
import { OWNER_CONTRACTS, OWNER_PROPERTIES, OWNER_REQUESTS, WALLET } from '@/path';

const Overview = ({ overview }: { overview: IOverviewByOwnerRes }) => {
    return (
        <div className="grid grid-cols-3 gap-4">
            <OverviewItem title="Tổng số căn hộ" value={overview.countProperties} href={OWNER_PROPERTIES} />
            <OverviewItem title="Đang cho thuê" value={overview.countUnavailableProperties} href={OWNER_CONTRACTS} />
            <OverviewItem title="Doanh thu trung bình" value={formatCurrency(overview.avgRevenue.VND)} href={WALLET} />
            <OverviewItem title="Yêu cầu thuê nhà" value={overview.countRentalRequest} href={OWNER_REQUESTS} />
            <OverviewItem title="Yêu cầu gia hạn" value={overview.countExtensionRequest} href={OWNER_CONTRACTS} />
            <OverviewItem title="Yêu cầu huỷ hợp đồng" value={overview.countCancelRequest} href={OWNER_CONTRACTS} />
        </div>
    );
};

export default Overview;
