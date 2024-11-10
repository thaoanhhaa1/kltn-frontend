'use client';

import AddChildReport from '@/app/(base)/reports/[reportId]/add-child-report';
import useBoolean from '@/hooks/useBoolean';
import { ownerAcceptReport } from '@/services/report-service';
import { useUserStore } from '@/stores/user-store';
import { Button, Divider, Flex } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

const OwnerHandleReport = ({
    reportChildId,
    reportId,
    ownerId,
}: {
    reportId: number;
    reportChildId: number;
    ownerId: string;
}) => {
    const [loading, setLoading] = useState(false);
    const { user } = useUserStore();
    const router = useRouter();
    const { value: isShowForm, setTrue: showForm, setFalse: hideForm } = useBoolean(false);

    const handleAcceptReport = async () => {
        setLoading(true);
        try {
            await ownerAcceptReport({ reportId, reportChildId });

            toast.success('Đã chấp nhận yêu cầu báo cáo');
            router.refresh();
        } catch (error) {
            toast.error((error as Error).message || 'Có lỗi xảy ra, vui lòng thử lại sau');
        } finally {
            setLoading(false);
        }
    };

    if (user?.userId === ownerId)
        return (
            <Flex vertical flex={1}>
                <Flex justify="flex-end" gap={12}>
                    <Button onClick={showForm}>Đề xuất xử lý khác</Button>
                    <Button loading={loading} type="primary" onClick={handleAcceptReport}>
                        Đồng ý với yêu cầu
                    </Button>
                </Flex>
                {isShowForm && (
                    <div>
                        <Divider />
                        <AddChildReport reportId={reportId} onCancel={hideForm} />
                    </div>
                )}
            </Flex>
        );

    return null;
};

export default OwnerHandleReport;
