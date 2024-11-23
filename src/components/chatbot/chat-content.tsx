import ChatItem from '@/components/chatbot/chat-item';
import ChatProperties from '@/components/chatbot/chat-properties';
import TypingChat from '@/components/typing-chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import useBoolean from '@/hooks/useBoolean';
import { secondsToMinutes } from '@/lib/utils';
import { chatService } from '@/services/chat-service';
import { useChatStore } from '@/stores/chatbot-store';
import { Button, Divider, Flex, Input } from 'antd';
import { Mic, Pause, Play, Send, StopCircle, X } from 'lucide-react';
import { ChangeEvent, Fragment, useEffect, useRef, useState } from 'react';

const ChatContent = ({ isFullScreen }: { isFullScreen: boolean }) => {
    const { chats, chat, loading, setChat, setLoading, addChat } = useChatStore((state) => state);
    const ref = useRef<HTMLDivElement>(null);
    const isFirst = useRef(true);
    const { value: isActiveMic, toggle: toggleMic } = useBoolean(false);
    const { value: isRecord, toggle: toggleRecord, setTrue: record, setFalse: stop } = useBoolean(false);
    const { value: isPlay, toggle: togglePlay, setTrue: play, setFalse: pause } = useBoolean(false);
    const [seconds, setSeconds] = useState(0);
    const secondRef = useRef<NodeJS.Timeout | undefined>();

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

    const handleClickMic = () => {
        toggleMic();
        record();
        secondRef.current = setInterval(() => {
            setSeconds((prev) => prev + 1);
        }, 1000);
    };

    const handleStopRecord = () => {
        stop();
        clearInterval(secondRef.current as NodeJS.Timeout);
    };

    const handleClickCancelMic = () => {
        toggleMic();
        setSeconds(0);
        stop();
        clearInterval(secondRef.current as NodeJS.Timeout);
    };

    useEffect(() => {
        console.log('useEffect');

        if (chats.length > 0 && isFirst.current && ref.current) {
            console.log('scrollTo');
            console.log([ref.current]);

            const containerElement = ref.current.querySelector('.scroll-area-content');
            const scrollElement = ref.current.querySelector('div[data-radix-scroll-area-viewport]');
            console.log('🚀 ~ useEffect ~ scrollElement:', [scrollElement]);

            if (!containerElement || !scrollElement) return;
            console.log('containerElement?.scrollHeight', containerElement?.scrollHeight);

            isFirst.current = false;
            scrollElement.scrollTo(0, containerElement?.scrollHeight);
        }
    }, [chats.length]);

    return (
        <div className="flex-1 flex flex-col justify-end">
            <ScrollArea className={isFullScreen ? 'h-[calc(100vh-150px)]' : 'max-h-[40vh] min-h-[300px]'} ref={ref}>
                <div className="scroll-area-content">
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
                </div>
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
                <div className="flex-1 flex items-center gap-2">
                    {(isActiveMic && (
                        <>
                            <Button
                                color="primary"
                                variant="text"
                                icon={<X className="w-5 h-5" />}
                                onClick={handleClickCancelMic}
                            />
                            <div className="flex-1 flex justify-between rounded-full bg-antd-primary items-center px-1.5">
                                {(isRecord && (
                                    <Button
                                        type="primary"
                                        icon={<StopCircle className="w-5 h-5" />}
                                        onClick={handleStopRecord}
                                    />
                                )) ||
                                    (isPlay && (
                                        <Button type="primary" icon={<Pause className="w-5 h-5" />} onClick={pause} />
                                    )) || <Button type="primary" icon={<Play className="w-5 h-5" />} onClick={play} />}
                                <div className="px-2 rounded-full bg-white text-antd-primary">
                                    {secondsToMinutes(seconds)}
                                </div>
                            </div>
                        </>
                    )) || (
                        <>
                            <Button
                                color="primary"
                                variant="text"
                                icon={<Mic className="w-5 h-5" />}
                                onClick={handleClickMic}
                            />
                            <Input
                                value={chat}
                                placeholder="Nhập tin nhắn..."
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                        </>
                    )}
                </div>
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
