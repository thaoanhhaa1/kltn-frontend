import { IRejectReason } from '@/interfaces/reject-reason';
import { formatDateTime } from '@/lib/utils';
import { XCircle } from 'lucide-react';

const RejectReason = ({ rejectReason }: { rejectReason: IRejectReason }) => {
    return (
        <div className="border-b border-red-200 last:border-b-0 pb-2">
            <div className="flex items-start space-x-2 mb-2">
                <XCircle className="text-red-500 mt-1" size={20} />
                <p className="text-base text-red-800 flex-1">{rejectReason.reason || 'Không có lý do cụ thể'}</p>
            </div>
            <p className="text-sm text-gray-500 ml-7">Ngày Từ Chối: {formatDateTime(rejectReason.createdAt)}</p>
        </div>
    );
};

export default RejectReason;
