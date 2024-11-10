'use client';

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
import { getReportByOwner } from '@/services/report-service';
import { Button, Col, Flex, Form, Select, TableProps, Tag, Tooltip } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { Eye, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

const ReportsTable = () => {
    const [form] = useForm<IReportFilterByOwner>();
    const { value: activeFilter, toggle: toggleFilter } = useBoolean(false);
    const [reports, setReports] = useState<IReport[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleViewDetail = useCallback(
        (id: number) => {
            router.push(`${REPORTS}/${id}`);
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
                    </Flex>
                ),
            },
        ],
        [handleViewDetail],
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
        </>
    );
};

export default ReportsTable;
