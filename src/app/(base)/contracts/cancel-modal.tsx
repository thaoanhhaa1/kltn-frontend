import { IContract } from '@/interfaces/contract';
import { formatCurrency } from '@/lib/utils';
import { DatePicker, Form, Modal, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';

const CancelModal = ({ contract, onClose }: { contract: IContract | null; onClose: () => void }) => {
    const [form] = useForm();

    const handleOk = () => {};

    return (
        <Modal
            title="Huỷ hợp đồng"
            okText="Huỷ hợp đồng"
            okType="danger"
            cancelText="Hủy"
            open={!!contract}
            onOk={handleOk}
            onCancel={onClose}
        >
            <Typography.Title level={5}>Thông tin hợp đồng</Typography.Title>
            {contract && (
                <Typography.Text>
                    <strong>Mã hợp đồng:</strong> {contract?.contract_id} <br />
                    <strong>Ngày bắt đầu:</strong> {dayjs(contract?.start_date).format('DD/MM/YYYY')} <br />
                    <strong>Ngày kết thúc:</strong> {dayjs(contract?.end_date).format('DD/MM/YYYY')} <br />
                    <strong>Giá:</strong> {formatCurrency(contract?.monthly_rent, true)} <br />
                    <strong>Tiền cọc:</strong> {formatCurrency(contract?.deposit_amount, true)} <br />
                </Typography.Text>
            )}
            <Typography.Title level={5}>Xác nhận huỷ hợp đồng</Typography.Title>
            <Typography.Text>
                Bạn có chắc chắn muốn huỷ hợp đồng này? Hãy chọn ngày kết thúc mong muốn để chúng tôi xử lý.
            </Typography.Text>
            <Form form={form}>
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
                    <DatePicker minDate={dayjs()} maxDate={dayjs(contract?.end_date)} />
                </Form.Item>
            </Form>
            <Typography.Text type="danger">
                Lưu ý: Nếu muốn huỷ hợp đồng trước hạn nhưng không thông báo trước 30 ngày thì sẽ mất tiền cọc và phải
                trả thêm 1 tháng tiền thuê cho chủ nhà.
            </Typography.Text>
        </Modal>
    );
};

export default CancelModal;
