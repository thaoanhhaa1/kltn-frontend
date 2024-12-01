'use client';

import RejectReasons from '@/components/reject-reasons/reject-reasons';
import useBoolean from '@/hooks/useBoolean';
import { IRejectReason } from '@/interfaces/reject-reason';
import { Button, Modal } from 'antd';

const RejectReasonsView = ({ rejectReasons }: { rejectReasons: IRejectReason[] }) => {
    const { value, setFalse, setTrue } = useBoolean(false);

    return (
        <>
            <Button onClick={setTrue}>Xem lý do từ chối</Button>
            <Modal title="Lý do từ chối" open={value} onCancel={setFalse} footer={null}>
                <RejectReasons loading={false} rejectReasons={rejectReasons} />
            </Modal>
        </>
    );
};

export default RejectReasonsView;
