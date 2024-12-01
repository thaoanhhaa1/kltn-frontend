'use client';

import AddChildReport from '@/app/(base)/reports/[reportId]/add-child-report';
import TableFilter from '@/components/table-filter';
import TablePagination from '@/components/table-pagination';
import { statusReportOwnerOptions } from '@/constants/init-data';
import useBoolean from '@/hooks/useBoolean';
import { IReport, IReportFilterByOwner, ReportPriority, ReportStatus, ReportType } from '@/interfaces/report';
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
import { getReportByOwner, ownerAcceptReport } from '@/services/report-service';
import { Button, Col, Flex, Form, Select, TableProps, Tag, Tooltip } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { Check, Eye, Filter, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

const NO_LOADING = 0;
const ACCEPT_LOADING = 1;
const REJECT_LOADING = 2;

const ReportsTable = () => {
    const [form] = useForm<IReportFilterByOwner>();
    const { value: activeFilter, toggle: toggleFilter } = useBoolean(false);
    const [reports, setReports] = useState<IReport[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [handleLoading, setHandleLoading] = useState<number>(NO_LOADING);
    const [report, setReport] = useState<IReport | null>(null);

    const handleViewDetail = useCallback(
        (id: number) => {
            router.push(`${REPORTS}/${id}`);
        },
        [router],
    );

    const handleAcceptReport = useCallback(
        async (report: IReport) => {
            setHandleLoading(ACCEPT_LOADING);
            setReport(report);
            try {
                await ownerAcceptReport({ reportId: report.id, reportChildId: report.reportChildId });

                setReports((prev) => prev.map((r) => (r.id === report.id ? { ...r, status: 'owner_accepted' } : r)));
                toast.success('Đã chấp nhận yêu cầu báo cáo');
                router.refresh();
            } catch (error) {
                toast.error((error as Error).message || 'Có lỗi xảy ra, vui lòng thử lại sau');
            } finally {
                setHandleLoading(NO_LOADING);
                setReport(null);
            }
        },
        [router],
    );

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
                                loading={handleLoading === ACCEPT_LOADING && report?.id === record.id}
                                onClick={() => handleAcceptReport(record)}
                                color="primary"
                                variant="text"
                                icon={<Check className="w-5 h-5" />}
                                disabled={record.status !== 'pending_owner'}
                            />
                        </Tooltip>
                        <Tooltip title="Từ chối">
                            <Button
                                type="primary"
                                danger
                                color="danger"
                                variant="text"
                                icon={<X className="w-5 h-5" />}
                                onClick={() => handleShowRejectModal(record)}
                                disabled={record.status !== 'pending_owner'}
                            />
                        </Tooltip>
                    </Flex>
                ),
            },
        ],
        [handleAcceptReport, handleLoading, handleViewDetail, report?.id],
    );

    const fetchReports = useCallback(async (data: IReportFilterByOwner) => {
        setLoading(true);

        try {
            const reports = await getReportByOwner(data);

            setReports(reports);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    }, []);

    const handleFilter = (values: IReportFilterByOwner) => {
        fetchReports(values);
    };

    const handleReset = () => {
        form.resetFields();
        fetchReports(form.getFieldsValue());
    };

    const handleShowRejectModal = (report: IReport) => {
        setReport(report);
    };

    const handleCancelReject = () => {
        setReport(null);
    };

    const handleReject = () => {
        setReports((prev) => prev.map((r) => (r.id === report?.id ? { ...r, status: 'pending_renter' } : r)));
    };

    useEffect(() => {
        fetchReports(form.getFieldsValue());
    }, [fetchReports, form]);

    return (
        <>
            <Flex gap="small" wrap justify="flex-end" className="my-4">
                <Button
                    type={activeFilter ? 'primary' : 'default'}
                    icon={<Filter className="w-5 h-5" />}
                    onClick={toggleFilter}
                />
            </Flex>
            {activeFilter && (
                <TableFilter<IReportFilterByOwner> onReset={handleReset} form={form} onFinish={handleFilter}>
                    <Col span={24}>
                        <Form.Item name="status" label="Trạng thái">
                            <Select options={statusReportOwnerOptions} placeholder="Chọn trạng thái" />
                        </Form.Item>
                    </Col>
                </TableFilter>
            )}
            <TablePagination loading={loading} columns={columns} dataSource={reports} />
            <AddChildReport
                onOK={handleReject}
                onCancel={handleCancelReject}
                reportId={report?.id || null}
                isModal
                okText="Gửi đề xuất"
                open={Boolean(report) && handleLoading !== ACCEPT_LOADING}
            />
        </>
    );
};

export default ReportsTable;
