'use client';

import AddReport from '@/app/(base)/contracts/[contractId]/add-report';
import useBoolean from '@/hooks/useBoolean';
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
import { cancelReportByRenter, findReportsByContractId } from '@/services/report-service';
import { Button, Flex, Table, TableProps, Tag, Tooltip } from 'antd';
import { Eye, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

const NO_LOADING = 0;
const CANCEL_LOADING = 1;

const Report = ({
    isRenter,
    contractId,
}: {
    isOwner: boolean;
    isRenter: boolean;
    isAdmin: boolean;
    contractId: string;
}) => {
    const [reports, setReports] = useState<IReport[]>([]);
    const [loading, setLoading] = useState(false);
    const { value: activeAdd, setFalse: hideAdd, setTrue: showAdd, toggle: toggleAdd } = useBoolean(false);
    const [loadingType, setLoadingType] = useState(NO_LOADING);
    const [loadingId, setLoadingId] = useState(-1);
    const router = useRouter();

    const handleCancelReport = useCallback(async (reportChildId: number, reportId: number) => {
        setLoadingType(CANCEL_LOADING);
        setLoadingId(reportChildId);

        try {
            await cancelReportByRenter(reportId);

            toast.success('Huỷ báo cáo thành công');

            setReports((prev) =>
                prev.map((report) =>
                    report.reportChildId === reportChildId ? { ...report, status: 'cancelled' } : report,
                ),
            );
        } catch (error) {
            toast.error((error as Error).message || 'Có lỗi xảy ra khi huỷ báo cáo');
        } finally {
            setLoadingType(NO_LOADING);
            setLoadingId(-1);
        }
    }, []);

    const handleViewDetail = useCallback(
        (reportId: number) => {
            router.push(`${REPORTS}/${reportId}`);
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
                        <Tooltip title="Huỷ">
                            <Button
                                disabled={record.status !== 'pending_owner'}
                                danger
                                type="text"
                                icon={<X className="w-5 h-5" />}
                                loading={loadingType === CANCEL_LOADING && loadingId === record.reportChildId}
                                onClick={() => handleCancelReport(record.reportChildId, record.id)}
                            />
                        </Tooltip>
                    </Flex>
                ),
            },
        ],
        [handleCancelReport, handleViewDetail, loadingId, loadingType],
    );

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);

            try {
                let reports: IReport[] = [];

                reports = await findReportsByContractId(contractId);

                setReports(reports);
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [contractId, isRenter]);

    return (
        <div>
            <Flex gap="small" wrap className="my-4">
                {isRenter && (
                    <Button
                        type={activeAdd ? 'primary' : 'default'}
                        className="ml-auto"
                        icon={<Plus className="w-5 h-5" />}
                        onClick={toggleAdd}
                    />
                )}
            </Flex>
            {activeAdd && <AddReport contractId={contractId} setReports={setReports} onCancel={hideAdd} />}
            {activeAdd || (
                <Table
                    style={{
                        marginTop: '16px',
                    }}
                    columns={columns}
                    scroll={{
                        x: 'max-content',
                    }}
                    loading={loading}
                    dataSource={reports}
                    rowKey={(record) => record.id.toString()}
                />
            )}
        </div>
    );
};

export default Report;
