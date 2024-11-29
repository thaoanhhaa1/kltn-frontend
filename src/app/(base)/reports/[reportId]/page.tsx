import CancelReport from '@/app/(base)/reports/[reportId]/cancel-report';
import ConfirmByOwner from '@/app/(base)/reports/[reportId]/confirm-by-owner';
import ConfirmByRenter from '@/app/(base)/reports/[reportId]/confirm-by-renter';
import Item from '@/app/(base)/reports/[reportId]/item';
import OwnerHandleReport from '@/app/(base)/reports/[reportId]/owner-handle-report';
import RenterHandlePropose from '@/app/(base)/reports/[reportId]/renter-handle-propose';
import ReportChildItem from '@/app/(base)/reports/[reportId]/report-child-item';
import ReportItem from '@/app/(base)/reports/[reportId]/report-item';
import TimelineItem from '@/app/(base)/reports/[reportId]/timeline-item';
import AntButtonLink from '@/components/button/ant-button-link';
import BackButton from '@/components/button/back-button';
import Text from '@/components/text';
import Title from '@/components/title';
import { IReportDetail } from '@/interfaces/report';
import {
    formatDateTime,
    getReportPriorityColor,
    getReportPriorityText,
    getReportStatusColor,
    getReportStatusText,
    getReportTypeColor,
    getReportTypeText,
} from '@/lib/utils';
import { HOME } from '@/path';
import { getReportDetailById } from '@/services/report-service';
import { Card, Col, Flex, Result, Row, Tag, Timeline } from 'antd';
import { cookies } from 'next/headers';
import Link from 'next/link';

const ReportDetailPage = async ({
    params: { reportId },
}: {
    params: {
        reportId: string;
    };
}) => {
    const cookiesStore = cookies();
    const accessToken = cookiesStore.get('accessToken')?.value!;
    let report: IReportDetail | null = null;

    try {
        report = await getReportDetailById(reportId, accessToken);
    } catch (error) {}

    if (!report)
        return (
            <Result
                status="404"
                title="404"
                subTitle="Xin lỗi, báo cáo bạn đang tìm kiếm không tồn tại."
                extra={
                    <AntButtonLink href={HOME} type="primary">
                        Trang chủ
                    </AntButtonLink>
                }
            />
        );

    const lastReportChild = report.reportChild.at(-1)!;
    const childReportOfRenter = report.reportChild.at(0)!;
    const childReportOfOwner = report.reportChild.at(1);

    const timelineItems = report.history.map((item) => ({
        color: item.status === 'owner_not_resolved' ? 'red' : item.status === 'renter_completed' ? 'green' : 'blue',
        label: formatDateTime(item.createdAt),
        children: <TimelineItem status={item.status} />,
    }));

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <header className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                    <BackButton />
                    <Title>{report.title}</Title>
                    <Flex gap={8}>
                        <Tag color={getReportTypeColor(report.type)}>{getReportTypeText(report.type)}</Tag>
                        <Tag color={getReportPriorityColor(report.priority)}>
                            {getReportPriorityText(report.priority)}
                        </Tag>
                        <Tag color={getReportStatusColor(lastReportChild.status)}>
                            {getReportStatusText(lastReportChild.status)}
                        </Tag>
                    </Flex>
                </div>
                <Flex gap={8}>
                    <ConfirmByOwner ownerId={report.ownerId} reportId={report.id} status={lastReportChild.status} />
                    <ConfirmByRenter renterId={report.renterId} reportId={report.id} status={lastReportChild.status} />
                    <CancelReport reportId={report.id} status={lastReportChild.status} renterId={report.renterId} />
                </Flex>
            </header>
            <main>
                <Row gutter={[12, 12]}>
                    <Item title="Chi tiết báo cáo">
                        <Card>
                            <Row gutter={[12, 12]}>
                                <Col span={12}>
                                    <ReportItem title="Mã hợp đồng">
                                        <Link href={`/contracts/${report.contractId}`}>{report.contractId}</Link>
                                    </ReportItem>
                                </Col>
                                <Col span={12}>
                                    <ReportItem title="Chủ nhà" description={report.owner.name} />
                                </Col>
                                <Col span={12}>
                                    <ReportItem title="Người báo cáo" description={report.renter.name} />
                                </Col>
                                <Col span={12}>
                                    <ReportItem title="Ngày báo cáo" description={formatDateTime(report.createdAt)} />
                                </Col>
                            </Row>
                        </Card>
                    </Item>
                    <Item title="Mô tả chi tiết">
                        <Card>
                            <Text>{report.description}</Text>
                        </Card>
                    </Item>
                    <ReportChildItem title="Yêu cầu xử lý từ người thuê" item={childReportOfRenter} />
                    {childReportOfOwner && <ReportChildItem title="Đề xuất từ chủ nhà" item={childReportOfOwner} />}
                    {lastReportChild.status === 'pending_owner' && (
                        <OwnerHandleReport
                            ownerId={report.ownerId}
                            reportChildId={lastReportChild.id}
                            reportId={report.id}
                        />
                    )}
                    {lastReportChild.status === 'pending_renter' && (
                        <RenterHandlePropose renterId={report.renterId} reportChildId={lastReportChild.id} />
                    )}
                    <Item title="Tiến trình xử lý">
                        <Timeline mode="left" items={timelineItems} />
                    </Item>
                </Row>
            </main>
        </div>
    );
};

export default ReportDetailPage;
