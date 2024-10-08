import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IConversation } from '@/interfaces/chat';
import { cn, getFileTypeText, getNameAvatar, getOtherUser } from '@/lib/utils';
import { useConversationStore } from '@/stores/conversation-store';
import { useSocketStore } from '@/stores/socket-store';
import { useUserStore } from '@/stores/user-store';
import { Badge, Flex, Typography } from 'antd';

const Conversation = ({ conversation }: { conversation: IConversation }) => {
    const { selectedConversation, setSelectedConversation } = useConversationStore();
    const { user } = useUserStore();
    const { socket } = useSocketStore();
    const otherUser = getOtherUser(conversation.participants, user?.userId!);
    const lastChat = (conversation.chats || []).at(-1);

    const handleSelectConversation = () => {
        setSelectedConversation(conversation);

        if (conversation.unreadCount > 0)
            socket?.emit('readConversation', {
                conversationId: conversation.conversationId,
                time: new Date().toISOString(),
            });
    };

    return (
        <div
            onClick={handleSelectConversation}
            className={cn(
                'p-2 rounded duration-300 hover:bg-black hover:bg-opacity-5 cursor-pointer',
                selectedConversation?.conversationId === conversation.conversationId && 'bg-black bg-opacity-5',
            )}
        >
            <Flex align="center" gap={12}>
                <Avatar className="border border-white">
                    <AvatarImage src={otherUser?.avatar || ''} />
                    <AvatarFallback>{getNameAvatar(otherUser?.name || '')}</AvatarFallback>
                </Avatar>
                <Flex flex={1} align="center" gap={8}>
                    <div className="flex-1">
                        <Typography.Title level={5} style={{ margin: 0 }}>
                            {otherUser?.name}
                        </Typography.Title>
                        <Typography.Text type="secondary" style={{ margin: 0 }}>
                            {lastChat?.medias[0]?.type && getFileTypeText(lastChat?.medias[0]?.type)}
                            {lastChat?.medias[0]?.type && lastChat?.message && ' - '}
                            {lastChat?.message}
                        </Typography.Text>
                    </div>
                    <Badge count={conversation.unreadCount} />
                </Flex>
            </Flex>
        </div>
    );
};

export default Conversation;
