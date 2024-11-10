import Item from '@/app/(base)/reports/[reportId]/item';
import MediaView from '@/app/(base)/reports/[reportId]/media-view';
import ReportItem from '@/app/(base)/reports/[reportId]/report-item';
import { ReportChild } from '@/interfaces/report';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Card, Flex } from 'antd';

const ReportChildItem = ({ title, item }: { title: string; item: ReportChild }) => {
    return (
        <Item title={title}>
            <Card>
                <Flex gap={6} vertical>
                    <ReportItem title="Đề xuất giải quyết" description={item.proposed} />
                    <ReportItem title="Ngày giải quyết" description={formatDate(item.resolvedAt)} />
                    {item.compensation > 0 && (
                        <ReportItem title="Bồi thường" description={formatCurrency(item.compensation, true)} />
                    )}
                    {item.evidences.length > 0 && (
                        <ReportItem title="Ảnh, video minh chứng">
                            <MediaView evidences={item.evidences} />
                        </ReportItem>
                    )}
                </Flex>
            </Card>
        </Item>
    );
};

export default ReportChildItem;
