'use client';

import Text from '@/components/text';
import Title from '@/components/title';
import { ContractExtensionRequestStatus, IExtensionRequest } from '@/interfaces/contract-extension-request';
import { formatDate, getExtensionRequestStatusColor, getExtensionRequestStatusText } from '@/lib/utils';
import { updateExtensionRequestStatus } from '@/services/contract-extension-request-service';
import { Button, Divider, Flex, Tag } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

const ExtensionRequest = ({ extensionRequest, isOwner }: { extensionRequest: IExtensionRequest; isOwner: boolean }) => {
    const router = useRouter();
    const [loadingType, setLoadingType] = useState<'APPROVE' | 'REJECT' | 'CANCEL' | null>(null);

    const handleUpdateStatus = async (status: ContractExtensionRequestStatus) => {
        try {
            await updateExtensionRequestStatus({
                contractId: extensionRequest.contractId,
                id: extensionRequest.id,
                status,
            });

            toast.success('Cập nhật trạng thái yêu cầu gia hạn thành công');
            router.refresh();
        } catch (error: any) {
            console.log(error);
            toast.error(error?.message || 'Có lỗi xảy ra khi cập nhật trạng thái yêu cầu gia hạn');
        } finally {
            setLoadingType(null);
        }
    };

    const handleApprove = () => {
        setLoadingType('APPROVE');
        handleUpdateStatus('APPROVED');
    };

    const handleReject = () => {
        setLoadingType('REJECT');
        handleUpdateStatus('REJECTED');
    };

    const handleCancel = () => {
        setLoadingType('CANCEL');
        handleUpdateStatus('CANCELLED');
    };

    return (
        <Flex vertical>
            <Divider
                style={{
                    marginBlock: '16px',
                }}
            />
            <Title level={4}>
                {extensionRequest.type === 'EXTEND_CONTRACT' ? 'Yêu cầu gia hạn hợp đồng' : 'Yêu cầu gia hạn giao dịch'}
            </Title>
            <Text>
                <strong>Thời gian ban đầu: </strong>
                {formatDate(extensionRequest.date)}
            </Text>
            <Text>
                <strong>
                    {extensionRequest.type === 'EXTEND_CONTRACT'
                        ? 'Thời gian gia hạn: '
                        : 'Thời gian gia hạn giao dịch: '}
                </strong>
                {formatDate(extensionRequest.extensionDate)}
            </Text>
            {extensionRequest.reason && (
                <Text>
                    <strong>Lý do: </strong>
                    {extensionRequest.reason}
                </Text>
            )}
            <Text>
                <strong>Ngày gửi yêu cầu: </strong>
                {formatDate(extensionRequest.createdAt)}
            </Text>
            <Flex
                style={{
                    marginTop: '8px',
                }}
                justify="space-between"
                align="center"
            >
                <Tag color={getExtensionRequestStatusColor(extensionRequest.status)}>
                    {getExtensionRequestStatusText(extensionRequest.status)}
                </Tag>
                {extensionRequest.status === 'PENDING' &&
                    (isOwner ? (
                        <Flex gap={8}>
                            <Button loading={loadingType === 'REJECT'} danger onClick={handleReject}>
                                Từ chối
                            </Button>
                            <Button loading={loadingType === 'APPROVE'} type="primary" onClick={handleApprove}>
                                Đồng ý
                            </Button>
                        </Flex>
                    ) : (
                        <Button loading={loadingType === 'CANCEL'} danger onClick={handleCancel}>
                            Hủy yêu cầu
                        </Button>
                    ))}
            </Flex>
        </Flex>
    );
};

export default ExtensionRequest;
