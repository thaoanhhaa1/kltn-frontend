import ChatItem from '@/components/chatbot/chat-item';
import ChatProperties from '@/components/chatbot/chat-properties';
import TypingChat from '@/components/typing-chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatService } from '@/services/chat-service';
import { useChatStore } from '@/stores/chatbot-store';
import { Button, Divider, Flex, Input } from 'antd';
import { Send } from 'lucide-react';
import { ChangeEvent, Fragment } from 'react';

const ChatContent = () => {
    const { chats, chat, loading, setChat, setLoading, addChat } = useChatStore((state) => state);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setChat(e.target.value);
    };

    const handleChat = async () => {
        setLoading(true);

        try {
            const res = await chatService({ query: chat });

            addChat(res);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            setChat('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleChat();
    };

    return (
        <div className="flex-1 flex flex-col justify-end">
            <ScrollArea className="max-h-[40vh] min-h-[300px]">
                <Flex gap={8} vertical>
                    {chats.map((chat, index) => (
                        <Fragment key={index}>
                            <ChatItem isMe content={chat.response.query} />
                            <ChatItem content={chat.response.result} />
                            {chat.response.source_documents.length ? (
                                <ChatProperties properties={chat.response.source_documents} />
                            ) : null}
                        </Fragment>
                    ))}
                    {loading && chat && <ChatItem isMe content={chat} />}
                </Flex>
                {loading && <TypingChat />}
            </ScrollArea>
            <Divider
                style={{
                    marginBlock: '12px 0px',
                }}
            />
            <Flex
                gap={12}
                style={{
                    marginTop: '12px',
                    paddingRight: '12px',
                }}
            >
                <Input value={chat} placeholder="Nhập tin nhắn..." onChange={handleChange} onKeyDown={handleKeyDown} />
                <Button
                    disabled={!chat}
                    loading={loading}
                    onClick={handleChat}
                    style={{
                        flexShrink: 0,
                    }}
                    icon={<Send className="w-5 h-5" />}
                />
            </Flex>
        </div>
    );
};

export default ChatContent;
