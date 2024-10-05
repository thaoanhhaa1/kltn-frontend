'use client';

import CancelModal from '@/app/(base)/contracts/cancel-modal';
import { IContract } from '@/interfaces/contract';
import { Button } from 'antd';
import { useState } from 'react';

const CancelContractButton = ({ contract }: { contract: IContract }) => {
    const [open, setOpen] = useState(false);

    const handleShow = () => setOpen(true);
    const onClose = () => setOpen(false);

    return (
        <>
            <Button onClick={handleShow} danger>
                Gửi yêu cầu huỷ
            </Button>
            <CancelModal contract={open ? contract : null} onClose={onClose} />
        </>
    );
};

export default CancelContractButton;
