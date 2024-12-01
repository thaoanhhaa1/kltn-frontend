'use client';

import TablePagination from '@/components/table-pagination';
import { IReport, ReportPriority, ReportStatus, ReportType } from '@/interfaces/report';
import {
    formatCurrency,
    formatDate,
    formatDateTime,
    getReportPriorityColor,
    getReportPriorityText,
    getReportStatusColor,
    getReportStatusText,
    getReportTypeColor,
    getReportTypeText,
} from '@/lib/utils';
import { REPORTS } from '@/path';
import { getReportByRenter, renterAcceptReport, renterRejectReport } from '@/services/report-service';
import { Button, Flex, TableProps, Tag, Tooltip } from 'antd';
import { Check, Eye, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

const NO_LOADING = 0;
const ACCEPT_LOADING = 1;
const REJECT_LOADING = 2;

const ReportsTable = () => {
    const [reports, setReports] = useState<IReport[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [handleLoading, setHandleLoading] = useState(NO_LOADING);
    const [reportChildId, setReportChildId] = useState<number | null>(null);

    const handleViewDetail = useCallback(
        (id: number) => {
            router.push(`${REPORTS}/${id}`);
        },
        [router],
    );

    const handleAcceptReport = useCallback(async (reportChildId: number) => {
        setHandleLoading(ACCEPT_LOADING);
        setReportChildId(reportChildId);

        try {
            await renterAcceptReport(reportChildId);

            toast.success('Đã chấp nhận đề xuất của chủ nhà');
            setReports((reports) =>
                reports.map((report) =>
                    report.reportChildId === reportChildId ? { ...report, status: 'renter_accepted' } : report,
                ),
            );
        } catch (error) {
            toast.error((error as Error).message || 'Có lỗi xảy ra, vui lòng thử lại sau');
        } finally {
            setHandleLoading(NO_LOADING);
            setReportChildId(null);
        }
    }, []);

    const handleRejectReport = useCallback(async (reportChildId: number) => {
        setHandleLoading(REJECT_LOADING);
        setReportChildId(reportChildId);

        try {
            await renterRejectReport(reportChildId);

            toast.success('Đã từ chối đề xuất của chủ nhà');
            setReports((reports) =>
                reports.map((report) =>
                    report.reportChildId === reportChildId ? { ...report, status: 'renter_rejected' } : report,
                ),
            );
        } catch (error) {
            toast.error((error as Error).message || 'Có lỗi xảy ra, vui lòng thử lại sau');
        } finally {
            setHandleLoading(NO_LOADING);
            setReportChildId(null);
        }
    }, []);

    const columns: TableProps<IReport>['columns'] = useMemo(
        () => [
            {
                title: 'ID',
                dataIndex: 'id',
                width: 50,
            },
            {
                title: 'Tiêu đề',
                dataIndex: 'title',
                width: 250,
            },
            {
                title: 'Loại báo cáo',
                dataIndex: 'type',
                width: 115,
                render: (type: ReportType) => (
                    <Tag color={getReportTypeColor(type)} className="uppercase">
                        {getReportTypeText(type)}
                    </Tag>
                ),
            },
            {
                title: 'Mức độ ưu tiên',
                dataIndex: 'priority',
                width: 130,
                render: (priority: ReportPriority) => (
                    <Tag color={getReportPriorityColor(priority)} className="uppercase">
                        {getReportPriorityText(priority)}
                    </Tag>
                ),
            },
            {
                title: 'Trạng thái',
                dataIndex: 'status',
                width: 100,
                render: (status: ReportStatus) => (
                    <Tag color={getReportStatusColor(status)}>{getReportStatusText(status)}</Tag>
                ),
            },
            {
                title: 'Đề xuất',
                dataIndex: 'proposed',
                width: 250,
            },
            {
                title: 'Bồi thường',
                dataIndex: 'compensation',
                width: 150,
                align: 'right',
                render: (compensation: number) =>
                    Number.isInteger(compensation) ? formatCurrency(compensation, true) : '-',
            },
            {
                title: 'Ngày giải quyết',
                dataIndex: 'resolvedAt',
                width: 170,
                render: formatDate,
            },
            {
                title: 'Ngày tạo',
                dataIndex: 'createdAt',
                width: 170,
                render: formatDateTime,
            },
            {
                title: 'Hành động',
                fixed: 'right',
                width: 110,
                render: (_, record) => (
                    <Flex justify="center">
                        <Tooltip title="Xem chi tiết">
                            <Button
                                type="text"
                                icon={<Eye className="w-5 h-5" />}
                                onClick={() => handleViewDetail(record.id)}
                            />
                        </Tooltip>
                        <Tooltip title="Đồng ý">
                            <Button
                                loading={handleLoading === ACCEPT_LOADING && reportChildId === record.reportChildId}
                                onClick={() => handleAcceptReport(record.reportChildId)}
                                color="primary"
                                variant="text"
                                icon={<Check className="w-5 h-5" />}
                                disabled={record.status !== 'pending_renter'}
                            />
                        </Tooltip>
                        <Tooltip title="Từ chối">
                            <Button
                                loading={handleLoading === REJECT_LOADING && reportChildId === record.reportChildId}
                                type="primary"
                                danger
                                color="danger"
                                variant="text"
                                icon={<X className="w-5 h-5" />}
                                onClick={() => handleRejectReport(record.reportChildId)}
                                disabled={record.status !== 'pending_renter'}
                            />
                        </Tooltip>
                    </Flex>
                ),
            },
        ],
        [handleAcceptReport, handleLoading, handleRejectReport, handleViewDetail, reportChildId],
    );

    const fetchReports = useCallback(async () => {
        setLoading(true);

        try {
            const reports = await getReportByRenter();

            setReports(reports);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    return (
        <>
            <TablePagination loading={loading} columns={columns} dataSource={reports} />
        </>
    );
};

export default ReportsTable;
