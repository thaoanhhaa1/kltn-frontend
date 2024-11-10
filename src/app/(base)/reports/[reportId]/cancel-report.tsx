'use client';

import { ReportStatus } from '@/interfaces/report';
import { cancelReportByRenter } from '@/services/report-service';
import { useUserStore } from '@/stores/user-store';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

const CancelReport = ({ reportId, status, renterId }: { reportId: number; status: ReportStatus; renterId: string }) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user } = useUserStore();

    const handleCancel = async () => {
        setLoading(true);

        try {
            await cancelReportByRenter(reportId);

            toast.success('Huỷ báo cáo thành công');

            router.refresh();
        } catch (error) {
            toast.error((error as Error).message || 'Có lỗi xảy ra khi huỷ báo cáo');
        } finally {
            setLoading(false);
        }
    };

    if (user?.userId === renterId && status === 'pending_owner')
        return (
            <Button loading={loading} danger onClick={handleCancel}>
                Huỷ
            </Button>
        );

    return null;
};

export default CancelReport;
