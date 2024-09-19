'use client';

import TablePagination from '@/components/table-pagination';
import { ContractStatus, IContract } from '@/interfaces/contract';
import { formatCurrency, formatDate, formatDateTime, getContractColor, getContractStatusText } from '@/lib/utils';
import { getContractsByRenter } from '@/services/contract-service';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, TableProps, Tag, Typography } from 'antd';
import { Eye, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const ContractsPage = () => {
    const [contracts, setContracts] = useState<IContract[]>([]);
    const [loading, setLoading] = useState(true);

    const columns: TableProps<IContract>['columns'] = useMemo(
        () => [
            {
                title: '#',
                dataIndex: 'contract_id',
                width: 50,
                render: (_: any, __: any, index: number) => index + 1,
            },
            {
                title: 'Mã nhà',
                dataIndex: 'property_id',
                width: 170,
            },
            {
                title: 'Tiêu đề',
                dataIndex: 'title',
                width: 170,
            },
            {
                title: 'Chủ nhà',
                dataIndex: 'owner',
                width: 170,
            },
            {
                title: 'Ngày bắt đầu',
                dataIndex: 'start_date',
                width: 170,
                render: formatDate,
            },
            {
                title: 'Ngày kết thúc',
                dataIndex: 'end_date',
                width: 170,
                render: formatDate,
            },
            {
                title: 'Giá',
                dataIndex: 'monthly_rent',
                width: 170,
                render: (value) => formatCurrency(value, true),
            },
            {
                title: 'Tiền cọc',
                dataIndex: 'deposit_amount',
                width: 170,
                render: (value) => formatCurrency(value, true),
            },
            {
                title: 'Trạng thái',
                dataIndex: 'status',
                width: 170,
                render: (status: ContractStatus) => {
                    return <Tag color={getContractColor(status)}>{getContractStatusText(status)}</Tag>;
                },
            },
            {
                title: 'Ngày tạo',
                dataIndex: 'created_at',
                width: 170,
                render: formatDateTime,
            },
            {
                title: 'Ngày cập nhật',
                dataIndex: 'updated_at',
                width: 170,
                render: formatDateTime,
            },
            {
                title: 'Hành động',
                fixed: 'right',
                align: 'center',
                width: 110,
                render: (contract: IContract) => (
                    <Space>
                        <Button type="text" icon={<Eye className="w-5 h-5" />} />
                        <Popconfirm
                            title="Bạn có chắc chắn muốn huỷ hợp đồng này?"
                            description="Hợp đồng sẽ được chuyển sang trạng thái 'Đã huỷ'."
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                            // onConfirm={() => handleSoftDeleteProperties(property.propertyId)}
                            okText="Đồng ý"
                            cancelText="Hủy"
                            okType="danger"
                        >
                            <Button type="text" danger icon={<X className="w-5 h-5" />} />
                        </Popconfirm>
                    </Space>
                ),
            },
        ],
        [],
    );

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const res = await getContractsByRenter();

                setContracts(res);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="mt-5">
            <Typography.Title
                style={{
                    textAlign: 'center',
                }}
                level={3}
            >
                Hợp đồng của tôi
            </Typography.Title>
            <TablePagination
                loading={loading}
                rowKey={(record) => record.contract_id}
                columns={columns}
                dataSource={contracts}
                // pagination={data.pageInfo}
                // rowSelection={{
                //     fixed: true,
                //     type: 'checkbox',
                //     selectedRowKeys,
                //     getCheckboxProps,
                //     onChange: setSelectedRowKeys,
                // }}
            />
        </div>
    );
};

export default ContractsPage;
