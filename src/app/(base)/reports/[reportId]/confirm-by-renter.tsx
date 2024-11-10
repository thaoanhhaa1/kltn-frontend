'use client';

import { ReportStatus } from '@/interfaces/report';
import { ownerNotResolveReport, renterCompleteReport } from '@/services/report-service';
import { useUserStore } from '@/stores/user-store';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

const NO_LOADING = 0;
const NOT_RESOLVE = 1;
const COMPLETE = 2;

const ConfirmByRenter = ({
    reportId,
    status,
    renterId,
}: {
    reportId: number;
    status: ReportStatus;
    renterId: string;
}) => {
    const { user } = useUserStore();
    const [loading, setLoading] = useState(NO_LOADING);
    const router = useRouter();

    const isRenter = user?.userId === renterId;

    const handleNotResolve = async () => {
        setLoading(NOT_RESOLVE);

        try {
            await ownerNotResolveReport(reportId);

            toast.success('Chủ nhà không giải quyết báo cáo thành công');
            router.refresh();
        } catch (error) {
            toast.error((error as Error).message || 'Có lỗi xảy ra khi chủ nhà không giải quyết báo cáo');
        } finally {
            setLoading(NO_LOADING);
        }
    };

    const handleComplete = async () => {
        setLoading(COMPLETE);

        try {
            await renterCompleteReport(reportId);

            toast.success('Hoàn thành báo cáo thành công');
            router.refresh();
        } catch (error) {
            toast.error((error as Error).message || 'Có lỗi xảy ra khi hoàn thành báo cáo');
        } finally {
            setLoading(NO_LOADING);
        }
    };

    if (!isRenter) return null;

    if (!['owner_accepted', 'renter_accepted', 'admin_resolved', 'in_progress'].includes(status)) return null;

    return (
        <>
            <Button danger loading={loading === NOT_RESOLVE} onClick={handleNotResolve}>
                Chủ nhà không giải quyết
            </Button>
            <Button type="primary" loading={loading === COMPLETE} onClick={handleComplete}>
                Hoàn thành
            </Button>
        </>
    );
};

export default ConfirmByRenter;
