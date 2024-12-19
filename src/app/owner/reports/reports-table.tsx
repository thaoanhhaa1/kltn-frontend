'use client';

import AddChildReport from '@/app/(base)/reports/[reportId]/add-child-report';
import TableFilter from '@/components/table-filter';
import TablePagination from '@/components/table-pagination';
import { priorityReportOptions, statusReportOwnerOptions, typeReportOwnerOptions } from '@/constants/init-data';
import { datePickerProps } from '@/constants/init-props';
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
import { getUsersByOwnerService } from '@/services/contract-service';
import { getReportByOwner, ownerAcceptReport } from '@/services/report-service';
import {
    Button,
    Col,
    DatePicker,
    Flex,
    Form,
    Input,
    Select,
    TablePaginationConfig,
    TableProps,
    Tag,
    Tooltip,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { FilterValue, SorterResult, SortOrder } from 'antd/es/table/interface';
import dayjs from 'dayjs';
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
    const [renters, setRenters] = useState<
        {
            value: string;
            label: string;
        }[]
    >([]);
    const [renterLoading, setRenterLoading] = useState(false);
    const [tableParams, setTableParams] = useState<{
        sortField?: string;
        sortOrder?: SortOrder;
    }>({});

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
                sorter: (a, b) => a.id - b.id,
            },
            {
                title: 'Tiêu đề',
                dataIndex: 'title',
                width: 250,
                sorter: (a, b) => a.title.localeCompare(b.title),
            },
            {
                title: 'Loại báo cáo',
                dataIndex: 'type',
                width: 135,
                sorter: (a, b) => a.type.localeCompare(b.type),
                render: (type: ReportType) => (
                    <Tag color={getReportTypeColor(type)} className="uppercase">
                        {getReportTypeText(type)}
                    </Tag>
                ),
            },
            {
                title: 'Người báo cáo',
                dataIndex: ['renter', 'name'],
                width: 150,
                sorter: (a, b) => a.renter.name.localeCompare(b.renter.name),
            },
            {
                title: 'Mức độ ưu tiên',
                dataIndex: 'priority',
                width: 150,
                sorter: (a, b) => a.priority.localeCompare(b.priority),
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
                sorter: (a, b) => a.status.localeCompare(b.status),
                render: (status: ReportStatus) => (
                    <Tag color={getReportStatusColor(status)}>{getReportStatusText(status)}</Tag>
                ),
            },
            {
                title: 'Đề xuất',
                dataIndex: 'proposed',
                width: 250,
                sorter: (a, b) => a.proposed.localeCompare(b.proposed),
            },
            {
                title: 'Bồi thường',
                dataIndex: 'compensation',
                width: 150,
                align: 'right',
                sorter: (a, b) => a.compensation - b.compensation,
                render: (compensation: number) =>
                    Number.isInteger(compensation) ? formatCurrency(compensation, true) : '-',
            },
            {
                title: 'Ngày giải quyết',
                dataIndex: 'resolvedAt',
                width: 170,
                sorter: (a, b) => dayjs(a.resolvedAt).diff(dayjs(b.resolvedAt)),
                render: formatDate,
            },
            {
                title: 'Ngày tạo',
                dataIndex: 'createdAt',
                width: 170,
                sorter: (a, b) => dayjs(a.createdAt).diff(dayjs(b.createdAt)),
                render: formatDateTime,
            },
            {
                title: 'Mã hợp đồng',
                dataIndex: 'contractId',
                width: 200,
                sorter: (a, b) => a.contractId.localeCompare(b.contractId),
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

    const fetchReports = useCallback(
        async (data: IReportFilterByOwner) => {
            setLoading(true);

            try {
                const reports = await getReportByOwner({
                    ...data,
                    resolvedAt: data.resolvedAt && dayjs(data.resolvedAt)?.format('YYYY-MM-DD'),
                    ...tableParams,
                });

                setReports(reports);
            } catch (error) {
            } finally {
                setLoading(false);
            }
        },
        [tableParams],
    );

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

    const handleTableChange = (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<IReport> | SorterResult<IReport>[],
    ) => {
        if (Array.isArray(sorter)) return;
        setTableParams({
            sortField: Array.isArray(sorter.field) ? sorter.field.at(-1) : sorter.field,
            sortOrder: sorter.order,
        });
    };

    useEffect(() => {
        fetchReports(form.getFieldsValue());
    }, [fetchReports, form]);

    useEffect(() => {
        const fetchRenters = async () => {
            setRenterLoading(true);

            try {
                const renters = await getUsersByOwnerService();

                setRenters(
                    renters.map((renter) => ({ value: renter.userId, label: renter.name + ' - ' + renter.email })),
                );
            } catch (error) {
            } finally {
                setRenterLoading(false);
            }
        };

        fetchRenters();
    }, []);

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
                    <Col span={8}>
                        <Form.Item name="contractId" label="Mã hợp đồng">
                            <Input allowClear placeholder="Nhập mã hợp đồng" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="renterId" label="Người báo cáo">
                            <Select
                                allowClear
                                options={renters}
                                loading={renterLoading}
                                placeholder="Chọn người báo cáo"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="title" label="Tiêu đề">
                            <Input allowClear placeholder="Nhập tiêu đề" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Ngày giải quyết" name="resolvedAt">
                            <DatePicker allowClear {...datePickerProps} placeholder="Ngày giải quyết" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="type" label="Loại báo cáo">
                            <Select allowClear options={typeReportOwnerOptions} placeholder="Chọn loại báo cáo" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="priority" label="Mức độ ưu tiên">
                            <Select allowClear options={priorityReportOptions} placeholder="Chọn mức độ ưu tiên" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="status" label="Trạng thái">
                            <Select allowClear options={statusReportOwnerOptions} placeholder="Chọn trạng thái" />
                        </Form.Item>
                    </Col>
                </TableFilter>
            )}
            <TablePagination loading={loading} columns={columns} dataSource={reports} onChange={handleTableChange} />
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
