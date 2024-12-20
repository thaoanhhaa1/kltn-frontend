import { app } from '@/config/firebase.config';
import { IMAGE, VIDEO } from '@/constants/media-type';
import { ChatStatus, IChat, IConversation } from '@/interfaces/chat';
import { ContractStatus, ICreateContractRequest } from '@/interfaces/contract';
import { ContractCancelRequestStatus } from '@/interfaces/contract-cancel-request';
import { ContractExtensionRequestStatus, ContractExtensionRequestType } from '@/interfaces/contract-extension-request';
import { IPagination } from '@/interfaces/pagination';
import { IAddress, PropertyStatus } from '@/interfaces/property';
import { RentalRequestStatus } from '@/interfaces/rentalRequest';
import { ReportPriority, ReportStatus, ReportType } from '@/interfaces/report';
import { TransactionStatus, TransactionType } from '@/interfaces/transaction';
import { IBaseUserEmbed } from '@/interfaces/user';
import { Role } from '@/types/role';
import { UserStatus } from '@/types/user-status';
import { RcFile } from 'antd/es/upload';
import { type ClassValue, clsx } from 'clsx';
import { toZonedTime } from 'date-fns-tz';
import dayjs from 'dayjs';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { viewerType } from 'react-documents';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getNameAvatar = (name: string) => {
    const splitName = name.split(' ');
    const length = splitName.length;

    return `${splitName[0][0]}${length > 1 ? splitName.at(-1)![0] : ''}`.toUpperCase();
};

export const getRoleColor = (role: Role) => {
    if (role === 'admin') return 'red';
    if (role === 'owner') return 'green';
    return 'blue';
};

export const getRoleText = (role: Role) => {
    if (role === 'admin') return 'Quản trị viên';
    if (role === 'owner') return 'Chủ nhà';
    return 'Người thuê';
};

export const getUserStatusColor = (userStatus: UserStatus) => {
    if (userStatus === 'ACTIVE') return 'success';
    if (userStatus === 'INACTIVE') return 'processing';
    if (userStatus === 'BLOCKED') return 'red';
    return 'error';
};

export const getUserStatusText = (userStatus: UserStatus) => {
    if (userStatus === 'ACTIVE') return 'Hoạt động';
    if (userStatus === 'INACTIVE') return 'Chờ xác nhận';
    if (userStatus === 'BLOCKED') return 'Bị chặn';
    if (userStatus === 'DELETED') return 'Đã xóa';
    return 'Không xác định';
};

export const getPropertyStatusColor = (propertyStatus: PropertyStatus) => {
    if (propertyStatus === 'ACTIVE') return 'success';
    if (propertyStatus === 'INACTIVE') return 'warning';
    if (propertyStatus === 'UNAVAILABLE') return 'purple';
    if (propertyStatus === 'REJECTED') return 'error';
    return 'processing';
};

export const getPropertyStatusText = (propertyStatus: PropertyStatus) => {
    if (propertyStatus === 'ACTIVE') return 'Đã duyệt';
    if (propertyStatus === 'INACTIVE') return 'Đã ẩn';
    if (propertyStatus === 'UNAVAILABLE') return 'Đã cho thuê';
    if (propertyStatus === 'REJECTED') return 'Đã từ chối';
    return 'Đang chờ duyệt';
};

export const getRentalRequestColor = (status: RentalRequestStatus) => {
    if (status === 'PENDING') return 'processing';
    if (status === 'APPROVED') return 'success';
    if (status === 'REJECTED') return 'error';
    if (status === 'CANCELLED') return 'warning';
    return 'default';
};

export const getRentalRequestStatusText = (status: RentalRequestStatus) => {
    if (status === 'PENDING') return 'Chờ xác nhận';
    if (status === 'APPROVED') return 'Đã xác nhận';
    if (status === 'REJECTED') return 'Đã từ chối';
    if (status === 'CANCELLED') return 'Đã hủy';
    return 'Không xác định';
};

export const getRentalRequestStatusCode = (status: string) => {
    if (status === 'Chờ xác nhận') return 'PENDING';
    if (status === 'Đã xác nhận') return 'APPROVED';
    if (status === 'Đã từ chối') return 'REJECTED';
    if (status === 'Đã hủy') return 'CANCELLED';
    return undefined;
};

export const getContractColor = (status: ContractStatus) => {
    if (status === 'WAITING') return 'processing';
    if (status === 'DEPOSITED') return 'warning';
    if (status === 'ONGOING') return 'success';
    if (status === 'ENDED') return 'default';
    if (status === 'OVERDUE') return 'error';
    if (status === 'CANCELLED') return 'volcano';
    if (status === 'PENDING_CANCELLATION') return 'cyan';
    if (status === 'UNILATERAL_CANCELLATION') return 'purple';
    if (status === 'APPROVED_CANCELLATION') return 'green';
    if (status === 'REJECTED_CANCELLATION') return 'red';
    return 'default';
};

export const getContractStatusText = (status: ContractStatus) => {
    if (status === 'WAITING') return 'Chờ xác nhận';
    if (status === 'DEPOSITED') return 'Đã đặt cọc';
    if (status === 'ONGOING') return 'Đang thuê';
    if (status === 'ENDED') return 'Đã kết thúc';
    if (status === 'OVERDUE') return 'Quá hạn';
    if (status === 'CANCELLED') return 'Đã hủy';
    if (status === 'PENDING_CANCELLATION') return 'Chờ xác nhận huỷ';
    if (status === 'UNILATERAL_CANCELLATION') return 'Huỷ một phía';
    if (status === 'APPROVED_CANCELLATION') return 'Chấp nhận huỷ';
    if (status === 'REJECTED_CANCELLATION') return 'Từ chối huỷ';
    return 'Không xác định';
};

export const getTransactionColor = (status: TransactionStatus) => {
    if (status === 'PENDING') return 'processing';
    if (status === 'COMPLETED') return 'success';
    if (status === 'FAILED') return 'error';
    if (status === 'OVERDUE') return 'warning';
    if (status === 'CANCELLED') return 'default';
    return 'default';
};

export const getTransactionStatusText = (status: TransactionStatus) => {
    if (status === 'PENDING') return 'Chờ thanh toán';
    if (status === 'COMPLETED') return 'Thành công';
    if (status === 'FAILED') return 'Thất bại';
    if (status === 'OVERDUE') return 'Quá hạn';
    if (status === 'CANCELLED') return 'Đã hủy';
    return 'Không xác định';
};

export const getTransactionStatusCode = (status: string): TransactionStatus | undefined => {
    if (status === 'Chờ thanh toán') return 'PENDING';
    if (status === 'Thành công') return 'COMPLETED';
    if (status === 'Thất bại') return 'FAILED';
    if (status === 'Quá hạn') return 'OVERDUE';
    if (status === 'Đã hủy') return 'CANCELLED';
    return undefined;
};

export const getTransactionTypeText = (type: TransactionType) => {
    switch (type) {
        case 'DEPOSIT':
            return 'Tiền đặt cọc';
        case 'RENT':
            return 'Thanh toán thuê nhà';
        case 'WITHDRAW':
            return 'Rút tiền';
        case 'REFUND':
            return 'Hoàn tiền';
        case 'CREATE_CONTRACT':
            return 'Tạo hợp đồng';
        case 'CANCEL_CONTRACT':
            return 'Huỷ hợp đồng';
        case 'END_CONTRACT':
            return 'Kết thúc hợp đồng';
        case 'COMPENSATION':
            return 'Bồi thường';
        case 'REPORT':
            return 'Báo cáo';
        default:
            return 'Không xác định';
    }
};

export const getCancelRequestColor = (status: ContractCancelRequestStatus) => {
    if (status === 'PENDING') return 'processing';
    if (status === 'APPROVED') return 'success';
    if (status === 'REJECTED') return 'error';
    if (status === 'CANCELLED') return 'default';
    if (status === 'CONTINUE') return 'warning';
    if (status === 'UNILATERAL_CANCELLATION') return 'purple';
    return 'default';
};

export const getCancelRequestStatusText = (status: ContractCancelRequestStatus) => {
    if (status === 'PENDING') return 'Chờ xác nhận';
    if (status === 'APPROVED') return 'Đã chấp nhận';
    if (status === 'REJECTED') return 'Đã từ chối';
    if (status === 'CANCELLED') return 'Đã hủy';
    if (status === 'CONTINUE') return 'Tiếp tục thuê';
    if (status === 'UNILATERAL_CANCELLATION') return 'Huỷ một phía';
    return 'Không xác định';
};

export const getChatStatusText = (status: ChatStatus) => {
    if (status === 'RECEIVED') return 'Đã nhận';
    if (status === 'READ') return 'Đã đọc';
    return 'Không xác định';
};

export const getExtensionRequestTypeText = (type: ContractExtensionRequestType) => {
    if (type === 'EXTEND_CONTRACT') return 'Gia hạn hợp đồng';
    if (type === 'EXTEND_PAYMENT') return 'Gia hạn thanh toán';
    return 'Không xác định';
};

export const getExtensionRequestStatusText = (status: ContractExtensionRequestStatus) => {
    if (status === 'PENDING') return 'Chờ xác nhận';
    if (status === 'APPROVED') return 'Đã chấp nhận';
    if (status === 'REJECTED') return 'Đã từ chối';
    if (status === 'CANCELLED') return 'Đã hủy';
    return 'Không xác định';
};

export const getExtensionRequestStatusColor = (status: ContractExtensionRequestStatus) => {
    if (status === 'PENDING') return 'processing';
    if (status === 'APPROVED') return 'success';
    if (status === 'REJECTED') return 'error';
    if (status === 'CANCELLED') return 'default';
    return 'default';
};

export const getAttributeTypeColor = (type: string) => {
    if (type === 'Amenity') return 'success';
    if (type === 'Highlight') return 'warning';
    if (type === 'Facility') return 'purple';
    return 'default';
};

export const getReportStatusColor = (status: ReportStatus) => {
    if (status === 'pending_owner') return 'processing';
    if (status === 'pending_renter') return 'processing';
    if (status === 'owner_proposed') return 'processing';
    if (status === 'owner_accepted') return 'success';
    if (status === 'renter_accepted') return 'success';
    if (status === 'renter_rejected') return 'error';
    if (status === 'admin_processing') return 'processing';
    if (status === 'admin_resolved') return 'success';
    if (status === 'in_progress') return 'processing';
    if (status === 'owner_completed') return 'success';
    if (status === 'renter_completed') return 'success';
    if (status === 'owner_not_resolved') return 'error';
    if (status === 'cancelled') return 'default';
    return 'default';
};

export const getReportStatusText = (status: ReportStatus) => {
    if (status === 'pending_owner') return 'Chờ xác nhận chủ nhà';
    if (status === 'pending_renter') return 'Chờ xác nhận người thuê';
    if (status === 'owner_proposed') return 'Chủ nhà đề xuất';
    if (status === 'owner_accepted') return 'Chủ nhà chấp nhận';
    if (status === 'renter_accepted') return 'Người thuê chấp nhận';
    if (status === 'renter_rejected') return 'Người thuê từ chối';
    if (status === 'admin_processing') return 'Admin xử lý';
    if (status === 'admin_resolved') return 'Admin đã giải quyết';
    if (status === 'in_progress') return 'Đang xử lý';
    if (status === 'owner_completed') return 'Chủ nhà đã hoàn thành';
    if (status === 'renter_completed') return 'Người thuê đã hoàn thành';
    if (status === 'owner_not_resolved') return 'Chủ nhà chưa giải quyết';
    if (status === 'cancelled') return 'Đã hủy';
    return 'Không xác định';
};

export const getReportTypeColor = (type: ReportType) => {
    if (type === 'incident') return 'error';
    if (type === 'violation') return 'warning';
    return 'default';
};

export const getReportTypeText = (type: ReportType) => {
    if (type === 'incident') return 'Sự cố';
    if (type === 'violation') return 'Vi phạm';
    return 'Không xác định';
};

export const getReportPriorityColor = (priority: ReportPriority) => {
    if (priority === 'low') return 'success';
    if (priority === 'medium') return 'warning';
    if (priority === 'high') return 'error';
    return 'default';
};

export const getReportPriorityText = (priority: ReportPriority) => {
    if (priority === 'low') return 'Thấp';
    if (priority === 'medium') return 'Trung bình';
    if (priority === 'high') return 'Cao';
    return 'Không xác định';
};

export const formatDate = (date: string | Date) => {
    return dayjs(date).format('DD/MM/YYYY');
};

export const formatDateTime = (dateTime: string | Date) => {
    return dayjs(dateTime).format('HH:mm:ss DD/MM/YYYY');
};

export const formatCurrency = (value: number, showVND?: boolean) => {
    const formatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    if (showVND) return formatted;
    return formatted.slice(0, formatted.length - 2);
};

export const toSkipTake = (page: number, pageSize: number): IPagination => {
    return {
        skip: (page - 1) * pageSize,
        take: pageSize,
    };
};

export const convertObjectToParams = (obj: Record<string, any>) => {
    const newObj = Object.entries(obj).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') acc[key] = value;
        return acc;
    }, {} as Record<string, any>);

    return new URLSearchParams(newObj).toString();
};

export function convertCurrencyToText(number: number): string {
    const units: { value: number; text: string }[] = [
        { value: 10 ** 9, text: 'tỷ' },
        { value: 10 ** 6, text: 'triệu' },
        { value: 10 ** 3, text: 'nghìn' },
        { value: 1, text: '' },
    ];

    for (const unit of units) {
        if (number >= unit.value) {
            const convertedNumber = Math.floor(number / unit.value);
            return `${convertedNumber} ${unit.text}`.trim();
        }
    }

    return number.toString();
}

export const convertDateToTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff <= 0) return 'Vừa xong';

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) return `${years} năm trước`;
    if (months > 0) return `${months} tháng trước`;
    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    if (minutes > 0) return `${minutes} phút trước`;
    return `${seconds} giây trước`;
};

export const convertDateToGMT = (date: Date | string) => {
    const dateGMT = new Date(date);
    dateGMT.setHours(dateGMT.getHours() + 7);

    return dateGMT;
};

export const combineConversations = (
    conversationsNew: Array<IConversation>,
    conversationsOld: Array<IConversation>,
) => {
    const conversationIds = conversationsNew.map((conversation) => conversation.conversationId);
    const newConversations = conversationsOld.filter(
        (conversation) => !conversationIds.includes(conversation.conversationId),
    );
    const conversationsNewCombined = conversationsNew.map((conversation) => {
        const oldConversation = conversationsOld.find((old) => old.conversationId === conversation.conversationId);

        if (!oldConversation) return conversation;

        const newChats = conversation.chats || [];
        const oldChats = (oldConversation.chats || []).filter(
            (chat) => !(conversation.chats || []).find((c) => c.chatId === chat.chatId),
        );

        return {
            ...oldConversation,
            ...conversation,
            chats: [...oldChats, ...newChats],
            unreadCount: oldConversation.unreadCount + conversation.unreadCount,
        };
    });

    return [...conversationsNewCombined, ...newConversations];
};

export const getOtherUser = (participants: Array<IBaseUserEmbed>, userId: string) => {
    return participants.find((participant) => participant.userId !== userId);
};

export const combineChats = (chatsLast: Array<IChat>, chatsOld?: Array<IChat>) => {
    if (!chatsOld) return chatsLast;

    const chatIds = chatsLast.map((chat) => chat.chatId);
    const newChats = chatsOld.filter((chat) => !chatIds.includes(chat.chatId));

    return [...chatsLast, ...newChats];
};

export const getTimeChat = (time: string) => {
    const date = dayjs(time);

    if (date.isSame(dayjs(), 'day')) return date.format('HH:mm');

    return date.format('HH:mm DD/MM/YYYY');
};

export const createChatConversation = (firstUser: string, secondUser: string) => {
    if (firstUser < secondUser) return `${firstUser}-${secondUser}`;

    return `${secondUser}-${firstUser}`;
};

export const getFileTypeText = (type: string) => {
    if (type.includes('image')) return '[Hình ảnh]';
    if (type.includes('video')) return '[Video]';
    if (type.includes('audio')) return '[Âm thanh]';

    return '[Tệp tin]';
};

// FIREBASE
const storage = getStorage(app);

export const uploadFile = ({ file, folder = 'general' }: { file: RcFile; folder?: string }): Promise<string> => {
    const fileName = `${Date.now()}-${file.name}`;
    const contentType = file.type;
    const metadata = {
        contentType,
    };

    const storageRef = ref(storage, folder + '/' + fileName);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    return new Promise((res, rej) => {
        uploadTask.on(
            'state_changed',
            () => {},
            rej,
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(res);
            },
        );
    });
};

export const uploadFiles = ({
    files,
    folder = 'general',
}: {
    files: RcFile[];
    folder?: string;
}): Promise<Array<string>> => {
    return Promise.all(files.map((file) => uploadFile({ file, folder })));
};

export const formatAddress = (address: IAddress) => {
    return `${address.street}, ${address.ward}, ${address.district}, ${address.city}`;
};

export const getMediaType = (type: string) => {
    if (type.startsWith('image/')) return IMAGE;
    if (type.startsWith('video/')) return VIDEO;

    return 'unknown';
};

export const isImage = (fileName: string) => /\.(jpe?g|png|gif|bmp)$/i.test(fileName.split('?')[0]);

export const officeCanView = (fileName: string): viewerType | undefined => {
    // if (/\.(ppt|pptx|doc|docx|xls|xlsx)$/i.test(fileName)) return 'office';
    if (/\.(txt|css|html|php|c|cpp|h|hpp|js|pdf|doc|docx|xls|xlsx)$/.test(fileName)) return 'google';
};

export const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export const getOwnerCreateContractMessage = (data: ICreateContractRequest) => {
    return `Tạo hợp đồng thuê nhà với ${data.renterId} tại ${data.propertyId} từ ${data.startDate} đến ${data.endDate} với giá ${data.monthlyRent} và cọc ${data.depositAmount}`;
};

export const convertToDMS = (lat: number, lng: number) => {
    function toDMS(coordinate: number, isLatitude: boolean): string {
        const degrees = Math.floor(Math.abs(coordinate));
        const minutes = Math.floor((Math.abs(coordinate) - degrees) * 60);
        const seconds = +(((Math.abs(coordinate) - degrees) * 60 - minutes) * 60).toFixed(1);
        const direction = coordinate >= 0 ? (isLatitude ? 'N' : 'E') : isLatitude ? 'S' : 'W';

        return `${degrees}°${String(minutes).padStart(2, '0')}'${seconds.toFixed(1)}"${direction}`;
    }

    return {
        latitude: toDMS(lat, true),
        longitude: toDMS(lng, false),
    };
};

// seconds to mm:ss
export const secondsToMinutes = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
};

export function getLocalTime(date: string | Date) {
    const localTime = toZonedTime(date, 'Asia/Ho_Chi_Minh');

    return localTime; //Output format: 9:30 PM
}

export const sumAmountCurrency = (amount: number, fee: number, isIncome: boolean) => {
    if (isIncome) return amount;

    return amount + (fee || 0);
};

export const formatEth = (
    eth: number,
    options: {
        decimal?: number;
        unit?: string;
    } = {
        decimal: 4,
        unit: 'ETH',
    },
) => {
    return `${(eth || 0).toFixed(options.decimal)} ${options.unit}`;
};
