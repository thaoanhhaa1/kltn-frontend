import { ContractCancelRequestStatus, IContractCancelRequestDetail } from '@/interfaces/contract-cancel-request';
import CustomError from '@/lib/error';
import { formatDate, formatDateTime, getCancelRequestColor, getCancelRequestStatusText } from '@/lib/utils';
import { updateContractCancelRequestStatus } from '@/services/contract-cancel-request-service';
import { useUserStore } from '@/stores/user-store';
import { Button, Divider, Flex, Tag } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

const ContractCancelRequest = ({ request }: { request: IContractCancelRequestDetail }) => {
    const router = useRouter();
    const { user } = useUserStore();
    const [indexLoading, setIndexLoading] = useState<number | null>(null);
    const isMyRequest = user?.userId === request.requestedBy;

    const handleUpdateStatus = async (status: Exclude<ContractCancelRequestStatus, 'PENDING'>) => {
        if (['REJECTED', 'UNILATERAL_CANCELLATION'].includes(status)) setIndexLoading(1);
        else if (status === 'CANCELLED') setIndexLoading(3);
        else setIndexLoading(2);

        try {
            await updateContractCancelRequestStatus({ requestId: request.id, status });

            router.refresh();
        } catch (error) {
            console.log('🚀 ~ handleUpdateStatus ~ error:', error);
            if (error instanceof CustomError) {
                toast.error(error.message);
            } else {
                toast.error('Đã xảy ra lỗi, vui lòng thử lại sau');
            }
        } finally {
            setIndexLoading(null);
        }
    };

    return (
        <div>
            <Divider
                style={{
                    marginBlock: '16px',
                }}
            />
            <div>
                <strong>Người gửi:</strong> {request.userRequest.name}
            </div>
            <div>
                <strong>Ngày gửi:</strong> {formatDateTime(request.requestedAt)}
            </div>
            <div>
                <strong>Ngày kết thúc hợp đồng:</strong> {formatDate(request.cancelDate)}
            </div>
            {request.reason && (
                <div>
                    <strong>Lý do huỷ:</strong> {request.reason}
                </div>
            )}
            <div className="mt-2">
                <strong>Trạng thái:</strong>{' '}
                <Tag color={getCancelRequestColor(request.status)}>{getCancelRequestStatusText(request.status)}</Tag>
            </div>
            {user ? (
                <Flex
                    gap={12}
                    style={{
                        marginTop: '12px',
                    }}
                >
                    {request.status === 'PENDING' && !isMyRequest && (
                        <>
                            <Button loading={indexLoading === 1} danger onClick={() => handleUpdateStatus('REJECTED')}>
                                Từ chối
                            </Button>
                            <Button
                                loading={indexLoading === 2}
                                type="primary"
                                onClick={() => handleUpdateStatus('APPROVED')}
                            >
                                Đồng ý
                            </Button>
                        </>
                    )}
                    {request.status === 'PENDING' && isMyRequest && (
                        <Button loading={indexLoading === 3} onClick={() => handleUpdateStatus('CANCELLED')} danger>
                            Huỷ yêu cầu
                        </Button>
                    )}
                    {request.status === 'REJECTED' && isMyRequest && (
                        <>
                            <Button
                                loading={indexLoading === 1}
                                danger
                                onClick={() => handleUpdateStatus('UNILATERAL_CANCELLATION')}
                            >
                                Đơn phương chấm dứt
                            </Button>
                            <Button
                                loading={indexLoading === 2}
                                type="primary"
                                onClick={() => handleUpdateStatus('CONTINUE')}
                            >
                                Tiếp tục thuê
                            </Button>
                        </>
                    )}
                </Flex>
            ) : null}
        </div>
    );
};

export default ContractCancelRequest;
