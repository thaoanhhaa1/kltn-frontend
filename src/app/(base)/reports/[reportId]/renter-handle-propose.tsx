'use client';

import { renterAcceptReport, renterRejectReport } from '@/services/report-service';
import { useUserStore } from '@/stores/user-store';
import { Button, Flex } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

export const NO_LOADING = 0;
export const REJECT_LOADING = 1;
export const ACCEPT_LOADING = 2;

const RenterHandlePropose = ({ renterId, reportChildId }: { renterId: string; reportChildId: number }) => {
    const { user } = useUserStore();
    const [loading, setLoading] = useState(NO_LOADING);
    const router = useRouter();

    const handleAccept = async () => {
        setLoading(ACCEPT_LOADING);
        try {
            await renterAcceptReport(reportChildId);

            router.refresh();
            toast.success('Đã chấp nhận đề xuất của chủ nhà');
        } catch (error) {
            toast.error((error as Error).message || 'Có lỗi xảy ra, vui lòng thử lại sau');
        } finally {
            setLoading(NO_LOADING);
        }
    };

    const handleReject = async () => {
        setLoading(REJECT_LOADING);
        try {
            await renterRejectReport(reportChildId);

            router.refresh();
            toast.success('Đã từ chối đề xuất của chủ nhà');
        } catch (error) {
            toast.error((error as Error).message || 'Có lỗi xảy ra, vui lòng thử lại sau');
        } finally {
            setLoading(NO_LOADING);
        }
    };

    if (user?.userId !== renterId) return null;

    return (
        <Flex justify="flex-end" gap={8} flex={1}>
            <Button loading={loading === REJECT_LOADING} danger onClick={handleReject}>
                Không đồng ý & Chuyển admin
            </Button>
            <Button loading={loading === ACCEPT_LOADING} type="primary" onClick={handleAccept}>
                Đồng ý
            </Button>
        </Flex>
    );
};

export default RenterHandlePropose;
