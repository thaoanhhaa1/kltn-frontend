'use client';

import { ReportStatus } from '@/interfaces/report';
import { ownerCompleteReport, ownerInProgressReport } from '@/services/report-service';
import { useUserStore } from '@/stores/user-store';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

const NO_LOADING = 0;
const IN_PROGRESS = 1;
const SUCCESS = 2;

const ConfirmByOwner = ({ reportId, status, ownerId }: { reportId: number; status: ReportStatus; ownerId: string }) => {
    const { user } = useUserStore();
    const [loading, setLoading] = useState(NO_LOADING);
    const router = useRouter();

    const isOwner = user?.userId === ownerId;

    const handleInProgress = async () => {
        setLoading(IN_PROGRESS);

        try {
            await ownerInProgressReport(reportId);

            toast.success('Bắt đầu giải quyết báo cáo thành công');
            router.refresh();
        } catch (error) {
            toast.error((error as Error).message || 'Có lỗi xảy ra khi bắt đầu giải quyết báo cáo');
        } finally {
            setLoading(NO_LOADING);
        }
    };

    const handleComplete = async () => {
        setLoading(SUCCESS);

        try {
            await ownerCompleteReport(reportId);

            toast.success('Hoàn thành báo cáo thành công');
            router.refresh();
        } catch (error) {
            toast.error((error as Error).message || 'Có lỗi xảy ra khi hoàn thành báo cáo');
        } finally {
            setLoading(NO_LOADING);
        }
    };

    if (!isOwner) return null;

    return (
        <>
            {['owner_accepted', 'renter_accepted', 'admin_resolved'].includes(status) && (
                <Button loading={loading === IN_PROGRESS} onClick={handleInProgress}>
                    Bắt đầu giải quyết
                </Button>
            )}
            {['owner_accepted', 'renter_accepted', 'admin_resolved', 'in_progress'].includes(status) && (
                <Button type="primary" loading={loading === SUCCESS} onClick={handleComplete}>
                    Hoàn thành
                </Button>
            )}
        </>
    );
};

export default ConfirmByOwner;
