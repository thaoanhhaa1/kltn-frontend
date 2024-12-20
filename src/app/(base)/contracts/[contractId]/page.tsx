import BackButton from '@/app/(base)/contracts/[contractId]/back-button';
import CancelContractButton from '@/app/(base)/contracts/[contractId]/cancel-contract-button';
import CancellationRequest from '@/app/(base)/contracts/[contractId]/cancellation-request';
import Report from '@/app/(base)/contracts/[contractId]/report';
import Transactions from '@/app/(base)/contracts/[contractId]/transactions';
import ViewContractButton from '@/app/(base)/contracts/[contractId]/view-contract-button';
import AvatarWithName from '@/components/avatar-with-name';
import AntButtonLink from '@/components/button/ant-button-link';
import Extension from '@/components/extension';
import ExtensionRequests from '@/components/extension-request/extension-requests';
import Forbidden from '@/components/forbidden';
import Review from '@/components/review/review';
import Title from '@/components/title';
import { IContractCancelRequestDetail } from '@/interfaces/contract-cancel-request';
import { IExtensionRequest } from '@/interfaces/contract-extension-request';
import { IReview } from '@/interfaces/review';
import { IUser } from '@/interfaces/user';
import CustomError from '@/lib/error';
import { formatAddress, formatCurrency, formatDate, getContractColor, getContractStatusText } from '@/lib/utils';
import { HOME } from '@/path';
import {
    getHandledContractCancelRequest,
    getNotHandledContractCancelRequest,
} from '@/services/contract-cancel-request-service';
import { getExtensionRequestByContractId } from '@/services/contract-extension-request-service';
import { getContractDetail } from '@/services/contract-service';
import { getReviewByContractId } from '@/services/review-service';
import { getMe } from '@/services/user-service';
import { Button, Card, Col, Empty, Flex, Result, Row, Tag } from 'antd';
import dayjs from 'dayjs';
import { CalendarIcon, MapPin, MessageCircle } from 'lucide-react';
import { cookies } from 'next/headers';

export default async function ContractDetails({ params: { contractId } }: { params: { contractId: string } }) {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    let contract;
    let user: IUser | null = null;
    let notHandledRequest: IContractCancelRequestDetail | null = null;
    let handledRequests: Array<IContractCancelRequestDetail> = [];
    let extensionRequests: Array<IExtensionRequest> = [];
    let review: IReview | null = null;

    try {
        [contract, user, notHandledRequest, handledRequests, extensionRequests, review] = await Promise.all([
            getContractDetail(contractId, accessToken!),
            getMe(accessToken!),
            getNotHandledContractCancelRequest(contractId, accessToken!),
            getHandledContractCancelRequest(contractId, accessToken!),
            getExtensionRequestByContractId({
                contractId,
                accessToken: accessToken!,
            }),
            getReviewByContractId(contractId, accessToken!),
        ]);
    } catch (error) {
        console.log('🚀 ~ ContractDetails ~ error:', error);
        if (error instanceof CustomError && error.statusCode === 403) return <Forbidden />;
    }

    if (!user || (!user.userTypes.includes('owner') && !user.userTypes.includes('renter'))) return <Forbidden />;

    if (!contract)
        return (
            <Result
                status="404"
                title="404"
                subTitle="Xin lỗi, hợp đồng bạn đang tìm kiếm không tồn tại."
                extra={
                    <AntButtonLink href={HOME} type="primary">
                        Trang chủ
                    </AntButtonLink>
                }
            />
        );

    const isOwner = user?.userId === contract.ownerId;
    const isRenter = user?.userId === contract.renterId;
    const isAdmin = user?.userTypes.includes('admin');
    const otherUser = isOwner ? contract.renter : contract.owner;

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <header className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                    <BackButton contract={contract} />
                    <Title>Chi tiết hợp đồng</Title>
                    <Tag color={getContractColor(contract.status)}>{getContractStatusText(contract.status)}</Tag>
                </div>
                <Flex gap={8}>
                    <CancelContractButton contract={contract} />
                    {isOwner || (
                        <Extension
                            contractId={contractId}
                            endDate={new Date(contract.endDate)}
                            type="EXTEND_CONTRACT"
                        />
                    )}
                    <ViewContractButton contractContent={contract.contractTerms} />
                    <Transactions contractId={contractId} />
                </Flex>
            </header>
            <Row gutter={[12, 12]}>
                <Col span={12}>
                    <Flex vertical gap={12}>
                        <Card>
                            <Flex vertical gap={24}>
                                <Title level={3}>{isOwner ? 'Thông tin người thuê' : 'Thông tin chủ nhà'}</Title>
                                <Flex gap={8} align="center">
                                    <div className="flex items-center space-x-4 flex-1">
                                        <AvatarWithName avatar={otherUser.avatar || ''} name={otherUser.name} />
                                        <div>
                                            <Title level={3}>{otherUser.name}</Title>
                                            <p className="text-muted-foreground">{otherUser.email}</p>
                                            <p className="text-muted-foreground">{otherUser.phoneNumber}</p>
                                        </div>
                                    </div>
                                    <Button type="default" icon={<MessageCircle className="w-5 h-5" />}>
                                        Nhắn tin
                                    </Button>
                                </Flex>
                            </Flex>
                        </Card>
                        <Card className="col-span-2">
                            <Flex vertical gap={24}>
                                <Title level={3}>Yêu cầu huỷ hợp đồng</Title>
                                <CancellationRequest
                                    cancelRequest={notHandledRequest}
                                    cancelRequestHandled={handledRequests}
                                />
                            </Flex>
                        </Card>
                        <Card>
                            <Flex vertical gap={24}>
                                <Title level={3}>Các ngày quan trọng</Title>
                                <ul className="space-y-2">
                                    <li className="flex items-center">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        <span>
                                            Ngày thanh toán tiền thuê: {dayjs(contract.startDate).date()} -{' '}
                                            {dayjs(contract.startDate).add(14, 'days').date()} hàng tháng
                                        </span>
                                    </li>
                                    <li className="flex items-center">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        <span>
                                            Ngày gia hạn hợp đồng: trước ngày{' '}
                                            {dayjs(contract.endDate).subtract(1, 'month').format('DD/MM/YYYY')}
                                        </span>
                                    </li>
                                </ul>
                            </Flex>
                        </Card>
                    </Flex>
                </Col>
                <Col span={12}>
                    <Flex vertical gap={12}>
                        <Card>
                            <Flex vertical gap={24}>
                                <Title level={3}>Thông tin bất động sản</Title>
                                <div className="space-y-2">
                                    <p className="flex items-center">
                                        <MapPin className="mr-2 h-4 w-4" /> {formatAddress(contract.property.address)}
                                    </p>
                                    <p>
                                        <strong>Loại:</strong> {contract.property.type.name}
                                    </p>
                                    {contract.property.rentalConditions.map((item) => (
                                        <p key={item.type}>
                                            <strong>{item.type}:</strong> {item.value}
                                        </p>
                                    ))}
                                </div>
                            </Flex>
                        </Card>
                        <Card>
                            <Flex vertical gap={24}>
                                <Title level={3}>Thông tin hợp đồng</Title>
                                <div>
                                    <p>
                                        <strong>Ngày bắt đầu thuê:</strong> {formatDate(contract.startDate)}
                                    </p>
                                    <p>
                                        <strong>Ngày kết thúc:</strong> {formatDate(contract.endDateActual)}
                                    </p>
                                    <p>
                                        <strong>Tiền thuê:</strong> {formatCurrency(contract.monthlyRent, true)}/tháng
                                    </p>
                                    <p>
                                        <strong>Tiền cọc:</strong> {formatCurrency(contract.depositAmount, true)}
                                    </p>
                                </div>
                            </Flex>
                        </Card>
                        <Card className="col-span-2">
                            <Flex vertical gap={24}>
                                <Title level={3}>Yêu cầu gia hạn</Title>
                                <ExtensionRequests isOwner={isOwner} extensionRequests={extensionRequests} />
                            </Flex>
                        </Card>
                    </Flex>
                </Col>
                <Col span={24}>
                    <Card className="col-span-2">
                        <Flex vertical gap={24}>
                            <Title level={3}>Báo cáo sự cố & vi phạm</Title>
                            <Report isAdmin={isAdmin} isOwner={isOwner} isRenter={isRenter} contractId={contractId} />
                        </Flex>
                    </Card>
                </Col>
                <Col span={24}>
                    <Card className="col-span-2">
                        <Flex vertical gap={24}>
                            <Title level={3}>Đánh giá</Title>
                            {review === null && <Empty description="Chưa có đánh giá" />}
                            {(contract.status === 'ENDED' || contract.status === 'CANCELLED') && (
                                <Review
                                    review={review}
                                    ownerId={contract.ownerId}
                                    contractId={contractId}
                                    propertyId={contract.propertyId}
                                    isAddReview
                                />
                            )}
                        </Flex>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
