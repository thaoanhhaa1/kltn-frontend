import { cn } from '@/lib/utils';
import Markdown from 'react-markdown';

const ChatItem = ({ isMe, content }: { isMe?: boolean; content: string }) => {
    return (
        <div
            className={cn(
                'max-w-[80%] border border-antd-primary rounded-md px-2 py-1 w-fit bg-antd-primary bg-opacity-10 mr-3',
                isMe ? 'ml-auto' : '',
            )}
        >
            <Markdown>{content}</Markdown>
        </div>
    );
};

export default ChatItem;
