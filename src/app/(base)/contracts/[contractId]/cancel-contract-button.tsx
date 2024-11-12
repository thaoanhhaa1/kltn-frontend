'use client';

import CancelModal from '@/app/(base)/contracts/cancel-modal';
import { IContract } from '@/interfaces/contract';
import { cancelContractBeforeDeposit } from '@/services/contract-service';
import { Button, Popconfirm } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

const CancelContractButton = ({ contract }: { contract: IContract }) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleShow = () => setOpen(true);
    const onClose = () => setOpen(false);

    const handleClickCancelBeforeDeposit = async () => {
        try {
            await cancelContractBeforeDeposit(contract.contractId);

            toast.success('Huỷ hợp đồng thành công');
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error('Huỷ hợp đồng thất bại');
        }
    };

    return (
        <>
            {(contract.status === 'WAITING' && (
                <Popconfirm
                    okText="Đồng ý"
                    okType="danger"
                    cancelText="Hủy"
                    title="Hủy hợp đồng?"
                    description="Hành động này không thể hoàn tác"
                    onConfirm={handleClickCancelBeforeDeposit}
                >
                    <Button danger>Gửi yêu cầu huỷ</Button>
                </Popconfirm>
            )) || (
                <Button onClick={handleShow} danger>
                    Gửi yêu cầu huỷ
                </Button>
            )}
            <CancelModal contract={open ? contract : null} onClose={onClose} />
        </>
    );
};

export default CancelContractButton;
