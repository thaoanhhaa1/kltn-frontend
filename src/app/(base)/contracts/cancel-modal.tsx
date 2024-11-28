import useSignMessageCustom from '@/hooks/useSignMessageCustom';
import { IContract } from '@/interfaces/contract';
import { ITable } from '@/interfaces/table';
import { formatCurrency } from '@/lib/utils';
import { createContractCancelRequest } from '@/services/contract-cancel-request-service';
import { useUserStore } from '@/stores/user-store';
import { DatePicker, Form, Modal, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'react-toastify';

const CancelModal = ({
    contract,
    onClose,
    setContracts,
}: {
    contract: IContract | null;
    onClose: () => void;
    setContracts?: Dispatch<SetStateAction<ITable<IContract>>>;
}) => {
    const router = useRouter();
    const { user } = useUserStore();
    const [form] = useForm();
    const [loading, setLoading] = useState(false);
    const { handleSign } = useSignMessageCustom();

    const handleOk = async () => {
        if (!contract?.contractId) return;

        try {
            await form.validateFields();

            const values = form.getFieldsValue();

            setLoading(true);

            const signature = await handleSign({
                message: `Hủy hợp đồng ${contract?.contractId} vào lúc ${dayjs(values.cancellationDate).format(
                    'YYYY-MM-DD',
                )}`,
            });

            const { contract: newContract } = await createContractCancelRequest({
                cancelDate: values.cancellationDate.format('YYYY-MM-DD'),
                contractId: contract?.contractId,
                reason: values.reason,
                signature,
            });

            if (setContracts)
                setContracts((contracts) => ({
                    ...contracts,
                    data: contracts.data.map((c) => (c.contractId === newContract.contractId ? newContract : c)),
                }));
            toast.success('Đã gửi yêu cầu huỷ hợp đồng');
            onClose();

            if (!setContracts) router.refresh();
        } catch (error) {
            console.error(error);
            toast.error((error as Error).message || 'Huỷ hợp đồng thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Huỷ hợp đồng"
            okText="Huỷ hợp đồng"
            okType="danger"
            cancelText="Hủy"
            open={!!contract}
            confirmLoading={loading}
            onOk={handleOk}
            onCancel={onClose}
        >
            <Typography.Title level={5}>Thông tin hợp đồng</Typography.Title>
            {contract && (
                <Typography.Text>
                    <strong>Mã hợp đồng:</strong> {contract?.contractId} <br />
                    <strong>Ngày bắt đầu:</strong> {dayjs(contract?.startDate).format('DD/MM/YYYY')} <br />
                    <strong>Ngày kết thúc:</strong> {dayjs(contract?.endDate).format('DD/MM/YYYY')} <br />
                    <strong>Giá:</strong> {formatCurrency(contract?.monthlyRent, true)} <br />
                    <strong>Tiền cọc:</strong> {formatCurrency(contract?.depositAmount, true)} <br />
                </Typography.Text>
            )}
            <Typography.Title level={5}>Xác nhận huỷ hợp đồng</Typography.Title>
            <Typography.Text>
                Bạn có chắc chắn muốn huỷ hợp đồng này? Hãy chọn ngày kết thúc mong muốn để chúng tôi xử lý.
            </Typography.Text>
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Ngày kết thúc mong muốn"
                    name="cancellationDate"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng chọn ngày kết thúc hợp đồng',
                        },
                    ]}
                >
                    <DatePicker
                        style={{
                            width: '100%',
                        }}
                        format="DD/MM/YYYY"
                        minDate={dayjs()}
                        maxDate={dayjs(contract?.endDate)}
                        placeholder="Chọn ngày kết thúc"
                    />
                </Form.Item>
                <Form.Item label="Lý do" name="reason">
                    <TextArea placeholder="Nhập lý do huỷ hợp đồng..." />
                </Form.Item>
            </Form>
            <Typography.Text type="danger">
                {user?.userId === contract?.ownerId
                    ? 'Lưu ý: Nếu muốn huỷ hợp đồng trước hạn nhưng không thông báo trước 30 ngày thì sẽ mất tiền cọc và phải trả thêm 1 tháng tiền thuê cho người thuê.'
                    : 'Lưu ý: Nếu muốn huỷ hợp đồng trước hạn nhưng không thông báo trước 30 ngày thì sẽ mất tiền cọc cho chủ nhà.'}
            </Typography.Text>
        </Modal>
    );
};

export default CancelModal;
