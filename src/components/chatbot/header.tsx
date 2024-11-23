'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, Flex, Typography } from 'antd';
import { Expand, Shrink, X } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

const Header = ({
    isFullScreen,
    setOpen,
    toggleFullScreen,
}: {
    isFullScreen: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    toggleFullScreen: () => void;
}) => {
    const handleClose = () => setOpen(false);
    const Icon = isFullScreen ? Shrink : Expand;

    return (
        <Flex className="p-3" gap={12} align="center">
            <Avatar>
                <AvatarImage src="/chatbot.png" alt="Chatbot" />
                <AvatarFallback>CB</AvatarFallback>
            </Avatar>
            <Typography.Title
                level={4}
                style={{
                    margin: 0,
                }}
            >
                Chatbot
            </Typography.Title>
            <Button
                type="text"
                icon={<Icon className="w-4 h-4" />}
                style={{
                    marginLeft: 'auto',
                }}
                onClick={toggleFullScreen}
            />
            <Button type="text" onClick={handleClose} icon={<X className="w-5 h-5" />} />
        </Flex>
    );
};

export default Header;
