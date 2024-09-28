import AvatarWithName from '@/components/avatar-with-name';
import { IChat } from '@/interfaces/chat';
import { cn, getTimeChat } from '@/lib/utils';
import { useUserStore } from '@/stores/user-store';
import { Image as AntdImage, Flex } from 'antd';
import Image from 'next/image';
import { useState } from 'react';

const ChatItem = ({ chat }: { chat: IChat }) => {
    const { user } = useUserStore();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const isMe = chat.sender.userId === user?.userId;

    return (
        <Flex
            gap={8}
            style={{
                width: '100%',
                flexDirection: isMe ? 'row-reverse' : 'row',
            }}
            align="end"
        >
            <AvatarWithName avatar={chat.sender.avatar || ''} name={chat.sender.name} />
            <div className={cn('flex-1 flex', isMe && 'justify-end')}>
                <div className="bg-antd-primary bg-opacity-5 rounded px-3 py-1.5 max-w-[70%]">
                    <div>{chat.message}</div>
                    {chat.medias.length ? (
                        <div>
                            {chat.medias.map((media) => (
                                <Image
                                    onClick={() => setSelectedImage(media.url)}
                                    alt=""
                                    src={media.url}
                                    key={media.url}
                                    width={200}
                                    height={200}
                                    className="w-[200px] object-cover"
                                />
                            ))}
                        </div>
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
