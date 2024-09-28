import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IConversation } from '@/interfaces/chat';
import { cn, getFileTypeText, getNameAvatar, getOtherUser } from '@/lib/utils';
import { useConversationStore } from '@/stores/conversation-store';
import { useUserStore } from '@/stores/user-store';
import { Flex, Typography } from 'antd';

const Conversation = ({ conversation }: { conversation: IConversation }) => {
    const { selectedConversation, setSelectedConversation } = useConversationStore();
    const { user } = useUserStore();
    const otherUser = getOtherUser(conversation.participants, user?.userId!);

    const handleSelectConversation = () => {
        setSelectedConversation(conversation);
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
                <div className="flex-1">
                    <Typography.Title level={5} style={{ margin: 0 }}>
                        {otherUser?.name}
                    </Typography.Title>
                    <Typography.Text type="secondary" style={{ margin: 0 }}>
                        {conversation.lastChat?.medias[0]?.type &&
                            getFileTypeText(conversation.lastChat?.medias[0]?.type)}
                        {conversation.lastChat?.medias[0]?.type && conversation.lastChat?.message && ' - '}
                        {conversation.lastChat?.message}
                    </Typography.Text>
                </div>
            </Flex>
        </div>
    );
};

export default Conversation;
