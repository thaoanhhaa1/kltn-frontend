import ChatItem from '@/components/chatbot/chat-item';
import ChatProperties from '@/components/chatbot/chat-properties';
import TypingChat from '@/components/typing-chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import useBoolean from '@/hooks/useBoolean';
import { secondsToMinutes } from '@/lib/utils';
import { chatService } from '@/services/chat-service';
import { speechToText } from '@/services/fpt-ai-service';
import { useChatStore } from '@/stores/chatbot-store';
import { Button, Divider, Flex, Input } from 'antd';
import { Mic, Pause, Play, Send, StopCircle, X } from 'lucide-react';
import { ChangeEvent, Fragment, useEffect, useRef, useState } from 'react';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { toast } from 'react-toastify';

const ChatContent = ({ isFullScreen }: { isFullScreen: boolean }) => {
    const { chats, chat, loading, setChat, setLoading, addChat } = useChatStore((state) => state);
    const ref = useRef<HTMLDivElement>(null);
    const isFirst = useRef(true);
    const { value: isActiveMic, setFalse: inActiveMic, setTrue: activeMic, toggle: toggleMic } = useBoolean(false);
    const { value: isRecord, setTrue: record, setFalse: stop } = useBoolean(false);
    const { value: isPlay, setTrue: play, setFalse: pause } = useBoolean(false);
    const { startRecording, stopRecording, recordingTime, recordingBlob } = useAudioRecorder();
    const [seconds, setSeconds] = useState(0);
    const [canSend, setCanSend] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handleScrollToBottom = () => {
        if (!ref.current) return;

        const containerElement = ref.current.querySelector('.scroll-area-content');
        const scrollElement = ref.current.querySelector('div[data-radix-scroll-area-viewport]');

        if (!containerElement || !scrollElement) return;

        isFirst.current = false;
        scrollElement.scrollTo(0, containerElement?.scrollHeight);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setChat(e.target.value);
    };

    const handlePause = () => {
        pause();

        if (audioRef.current) audioRef.current.pause();
    };

    const handleChat = async () => {
        if (audioRef.current) audioRef.current.pause();

        setLoading(true);

        try {
            let query = chat.trim();

            if (recordingBlob && canSend) {
                const result = await speechToText(recordingBlob);

                query = result.hypotheses
                    .map((hypothesis) => hypothesis.utterance)
                    .join(' ')
                    .trim();
            }

            if (!query) throw new Error('Vui lòng nhập tin nhắn hoặc ghi âm');

            const res = await chatService({ query });

            addChat(res);
            handleScrollToBottom();
        } catch (error) {
            console.log(error);

            toast.error((error as Error).message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
            setChat('');
            handleClickCancelMic();
            setCanSend(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleChat();
    };

    const handleClickMic = () => {
        startRecording();
        activeMic();
        record();
    };

    const handleStopRecord = () => {
        stopRecording();
        stop();
        setSeconds(recordingTime);
        setCanSend(true);
    };

    const handleClickCancelMic = () => {
        inActiveMic();
        stop();
        setSeconds(0);
        stopRecording();
        setCanSend(false);
    };

    const handlePlay = () => {
        if (!recordingBlob) return;

        play();

        const audioUrl = URL.createObjectURL(recordingBlob);
        const audioElement = new Audio(audioUrl);
        audioRef.current = audioElement;

        audioElement.play();

        audioElement.onended = () => {
            pause();
        };

        audioElement.onerror = () => {
            pause();
        };

        audioElement.onpause = () => {
            pause();
        };

        audioElement.ontimeupdate = () => {
            setSeconds(Math.floor(audioElement.currentTime));
        };
    };

    useEffect(() => {
        console.log('useEffect');

        if (chats.length > 0 && isFirst.current) {
            handleScrollToBottom();
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
                                        <Button
                                            type="primary"
                                            icon={<Pause className="w-5 h-5" />}
                                            onClick={handlePause}
                                        />
                                    )) || (
                                        <Button
                                            type="primary"
                                            icon={<Play className="w-5 h-5" />}
                                            onClick={handlePlay}
                                        />
                                    )}
                                <div className="px-2 rounded-full bg-white text-antd-primary">
                                    {secondsToMinutes(recordingTime || seconds)}
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
                    disabled={!chat && !canSend}
                    loading={loading}
                    onClick={handleChat}
                    style={{
                        flexShrink: 0,
                    }}
                    icon={<Send className="w-5 h-5" />}
                />
            </Flex>
            <div className="hidden">
                <AudioRecorder />
            </div>
        </div>
    );
};

export default ChatContent;
