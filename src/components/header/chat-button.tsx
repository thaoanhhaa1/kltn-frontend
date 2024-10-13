'use client';

import { Button } from '@/components/ui/button';
import { CHAT } from '@/path';
import { useConversationStore } from '@/stores/conversation-store';
import { Badge } from 'antd';
import { MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ChatButton = () => {
    const { unreadCount } = useConversationStore();
    const router = useRouter();

    const handleChat = () => {
        router.push(CHAT);
    };

    return (
        <Badge count={unreadCount}>
            <Button onClick={handleChat} variant="outline" size="icon">
                <MessageCircle className="w-5 h-5" />
            </Button>
        </Badge>
    );
};

export default ChatButton;
