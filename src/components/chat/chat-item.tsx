import AvatarWithName from '@/components/avatar-with-name';
import ViewMediaChat from '@/components/chat/view-media-chat';
import { IChat } from '@/interfaces/chat';
import { cn, getTimeChat } from '@/lib/utils';
import { useConversationStore } from '@/stores/conversation-store';
import { useUserStore } from '@/stores/user-store';
import { Image as AntdImage, Flex } from 'antd';
import { useState } from 'react';
import { v4 } from 'uuid';

const ChatItem = ({ chat }: { chat: IChat }) => {
    const { user } = useUserStore();
    const { selectedConversation } = useConversationStore();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const isMe = chat.senderId === user?.userId;

    if (!selectedConversation) return null;

    const sender = selectedConversation.participants.find((participant) => participant.userId === chat.senderId)!;

    return (
        <Flex
            gap={8}
            style={{
                width: '100%',
                flexDirection: isMe ? 'row-reverse' : 'row',
            }}
            align="end"
        >
            <AvatarWithName avatar={sender.avatar || ''} name={sender.name} />
            <div className={cn('flex-1 flex', isMe && 'justify-end')}>
                <div className="bg-antd-primary bg-opacity-5 rounded px-3 py-1.5 max-w-[70%]">
                    <div>{chat.message}</div>
                    {chat.medias.length ? (
                        <Flex vertical gap={8}>
                            {chat.medias.map((media) => (
                                <ViewMediaChat media={media} key={v4()} />
                            ))}
                        </Flex>
                    ) : null}
                    <div>
                        <span className="text-xs text-antd-primary-6">{getTimeChat(chat.createdAt)}</span>
                    </div>
                </div>
            </div>
            {selectedImage && (
                <AntdImage
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: !!selectedImage,
                        onVisibleChange: (visible) => visible || setSelectedImage(null),
                    }}
                    src={selectedImage}
                />
            )}
        </Flex>
    );
};

export default ChatItem;
