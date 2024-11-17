import Text from '@/components/text';
import Title from '@/components/title';
import { ReportStatus } from '@/interfaces/report';
import { Flex } from 'antd';

const getTitle = (status: ReportStatus) => {
    switch (status) {
        case 'pending_owner':
            return 'Báo cáo được tạo';
        case 'owner_accepted':
        case 'owner_proposed':
            return 'Chủ nhà phản hồi';
        case 'cancelled':
            return 'Báo cáo đã bị huỷ';
        case 'renter_accepted':
        case 'renter_rejected':
            return 'Người thuê phản hồi';
        case 'admin_resolved':
            return 'Admin đã giải quyết báo cáo';
        case 'in_progress':
            return 'Sự cố/vi phạm đang được xử lý bởi chủ nhà';
        case 'owner_completed':
            return 'Chủ nhà đã khắc phục sự cố/vi phạm';
        case 'renter_completed':
            return 'Người thuê đã xác nhận sự cố/vi phạm đã được khắc phục';
        case 'owner_not_resolved':
            return 'Chủ nhà đã không khắc phục sự cố/vi phạm';
        default:
            return status;
    }
};

const getSubtitle = (status: ReportStatus) => {
    switch (status) {
        case 'pending_owner':
            return 'Đang chờ phản hồi từ chủ nhà';
        case 'owner_accepted':
            return 'Chủ nhà đã chấp nhận yêu cầu';
        case 'owner_proposed':
            return 'Chủ nhà đã đề xuất xử lý khác và chờ phản hồi người thuê';
        case 'renter_accepted':
            return 'Người thuê đã chấp nhận đề xuất của chủ nhà';
        case 'renter_rejected':
            return 'Người thuê đã từ chối đề xuất của chủ nhà';
    }
};

const TimelineItem = ({ status }: { status: ReportStatus }) => {
    const subtitle = getSubtitle(status);

    return (
        <Flex gap={4} vertical>
            <Title level={5}>{getTitle(status)}</Title>
            {subtitle && <Text>{subtitle}</Text>}
        </Flex>
    );
};

export default TimelineItem;
