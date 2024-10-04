import { IContract } from '@/interfaces/contract';
import { cancelContractBeforeDeposit } from '@/services/contract-service';
import { Button, Popconfirm } from 'antd';
import { X } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'react-toastify';

const CancelBeforeDeposit = ({
    contractId,
    setContracts,
}: {
    contractId: string;
    setContracts: Dispatch<SetStateAction<Array<IContract>>>;
}) => {
    const handleClickCancelBeforeDeposit = async () => {
        try {
            const newContract = await cancelContractBeforeDeposit(contractId);

            setContracts((prev) =>
                prev.map((contract) => (contract.contractId === contractId ? newContract : contract)),
            );
            toast.success('Huỷ hợp đồng thành công');
        } catch (error) {
            console.error(error);
            toast.error('Huỷ hợp đồng thất bại');
        }
    };

    return (
        <Popconfirm
            okText="Đồng ý"
            okType="danger"
            cancelText="Hủy"
            title="Hủy hợp đồng?"
            description="Hành động này không thể hoàn tác"
            onConfirm={handleClickCancelBeforeDeposit}
        >
            <Button type="text" danger icon={<X className="w-5 h-5" />} />
        </Popconfirm>
    );
};

export default CancelBeforeDeposit;