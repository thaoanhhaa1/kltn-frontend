import RejectReason from '@/components/reject-reasons/reject-reason';
import { IRejectReason } from '@/interfaces/reject-reason';
import { Empty, Flex, Spin } from 'antd';

const RejectReasons = ({ loading, rejectReasons }: { rejectReasons: IRejectReason[]; loading?: boolean }) => {
    return (
        <div>
            {loading && (
                <Flex justify="center">
                    <Spin size="large" />
                </Flex>
            )}
            {!loading && rejectReasons.length === 0 && (
                <Empty description="Không có lý do từ chối" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
            <Flex vertical gap={12}>
                {rejectReasons.map((rejectReason) => (
                    <RejectReason key={rejectReason.id} rejectReason={rejectReason} />
                ))}
            </Flex>
        </div>
    );
};

export default RejectReasons;
