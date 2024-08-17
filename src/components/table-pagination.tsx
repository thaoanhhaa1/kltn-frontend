'use client';

import { Table, TableProps } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useRouter } from 'next/navigation';

interface TablePaginationProps<T> extends TableProps<T> {
    columns: ColumnsType<T>;
}

const TablePagination = <T extends object>(props: TablePaginationProps<T>) => {
    const router = useRouter();

    const columnsCustom = props.columns?.map((column) => {
        return {
            ...column,
            render: (text: any, record: any, index: number) => {
                return column.render ? column.render(text, record, index) : text ?? '-';
            },
        };
    });

    return (
        <Table
            scroll={{
                x: 'max-content',
            }}
            {...props}
            columns={columnsCustom}
            pagination={{
                showSizeChanger: true,
                onChange(page, pageSize) {
                    router.push(`?page=${page}&pageSize=${pageSize}`);
                },
                onShowSizeChange(current, size) {
                    router.push(`?page=${current}&pageSize=${size}`);
                },
                ...props.pagination,
            }}
        />
    );
};

export default TablePagination;
