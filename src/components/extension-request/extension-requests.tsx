import ExtensionRequest from '@/components/extension-request/extension-request';
import { IExtensionRequest } from '@/interfaces/contract-extension-request';
import { Empty } from 'antd';

const ExtensionRequests = ({
    extensionRequests,
    isOwner,
}: {
    extensionRequests: IExtensionRequest[];
    isOwner: boolean;
}) => {
    return (
        <div>
            {extensionRequests.length ? (
                extensionRequests.map((request) => (
                    <ExtensionRequest key={request.id} isOwner={isOwner} extensionRequest={request} />
                ))
            ) : (
                <Empty description="Không có yêu cầu gia hạn nào" />
            )}
        </div>
    );
};

export default ExtensionRequests;
