'use client';

import { IChatbot } from '@/interfaces/chatbot';
import { useChatStore } from '@/stores/chatbot-store';
import { useEffect } from 'react';

const SaveChatbot = ({ chatbot }: { chatbot: Array<IChatbot> }) => {
    const { addChats } = useChatStore();

    useEffect(() => {
        addChats(chatbot);
    }, [addChats, chatbot]);

    return null;
};

export default SaveChatbot;
