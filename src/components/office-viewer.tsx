import AvatarWithName from '@/components/avatar-with-name';
import Portal from '@/components/portal';
import { envConfig } from '@/config/envConfig';
import useBoolean from '@/hooks/useBoolean';
import useDownloadFile from '@/hooks/useDownloadFile';
import { IMediaType } from '@/interfaces/chat';
import { useConversationStore } from '@/stores/conversation-store';
import { useUserStore } from '@/stores/user-store';
import { Button, Spin } from 'antd';
import { Download, X } from 'lucide-react';
import { DocumentViewer, viewerType } from 'react-documents';

const OfficeViewer = ({
    media,
    onClose = () => {},
}: {
    media: IMediaType;
    viewer: viewerType;
    onClose: () => void;
}) => {
    const { user } = useUserStore();
    const { selectedConversation } = useConversationStore();
    const { value: loading, setFalse: stopLoading } = useBoolean(true);
    const download = useDownloadFile({
        name: media.name,
        src: media.url,
    });
    const otherUser = selectedConversation?.participants.find((participant) => participant.userId !== user!.userId)!;

    return (
        <Portal>
            <div className="fixed flex flex-col inset-0 bg-white z-50">
                <div className="relative flex-1">
                    <DocumentViewer
                        // viewer={viewer}
                        queryParams="hl=Nl"
                        url={media.url}
                        overrideLocalhost={envConfig.NEXT_PUBLIC_DOC_VIEWER}
                        loaded={stopLoading}
                    />

                    {loading ? (
                        <div className="absolute inset-0 flex justify-center items-center bg-white z-1">
                            <Spin />
                        </div>
                    ) : null}
                </div>
                <div className="flex items-center border-t border-separate dark:border-dark-separate flex-shrink-0 px-5 h-[60px]">
                    <div className="flex-1 flex items-center">
                        <AvatarWithName avatar={otherUser.avatar || ''} name={otherUser.name} />
                        <div className="ml-2">
                            <h4 className="text-sm font-medium">{media.name}</h4>
                            <p className="mt-0.5 text-ss">{otherUser.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button icon={<Download />} onClick={download} />
                        <Button icon={<X />} onClick={onClose} />
                    </div>
                </div>
            </div>
        </Portal>
    );
};

export default OfficeViewer;
