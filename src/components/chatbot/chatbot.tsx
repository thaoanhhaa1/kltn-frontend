'use client';

import ChatContent from '@/components/chatbot/chat-content';
import Header from '@/components/chatbot/header';
import LoginRequire from '@/components/chatbot/login-require';
import { IUser } from '@/interfaces/user';
import { Divider, Flex, FloatButton } from 'antd';
import { MessageCircleMoreIcon } from 'lucide-react';
import { useCallback, useState } from 'react';

const Chatbot = ({ user }: { user?: IUser }) => {
    const [open, setOpen] = useState(false);

    const toggleOpen = useCallback(() => {
        setOpen((prev) => !prev);
    }, []);

    return (
        <>
            <FloatButton type="primary" icon={<MessageCircleMoreIcon className="w-5 h-5" />} onClick={toggleOpen} />
            {open && (
                <Flex
                    vertical
                    className="fixed right-6 bottom-[112px] w-[350px] bg-white overflow-hidden rounded-md border shadow-[2px_2px_10px_3px_rgba(0,0,0,0.1)]"
                >
                    <Header setOpen={setOpen} />
                    <Divider
                        style={{
                            margin: 0,
                        }}
                    />
                    <div className="py-3 pl-3 flex-1 flex">{user ? <ChatContent /> : <LoginRequire />}</div>
                </Flex>
            )}
        </>
    );
};

export default Chatbot;
