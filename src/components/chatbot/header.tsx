'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, Flex, Typography } from 'antd';
import { Expand, X } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

const Header = ({ setOpen }: { setOpen: Dispatch<SetStateAction<boolean>> }) => {
    const handleClose = () => setOpen(false);

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
                icon={<Expand className="w-4 h-4" />}
                style={{
                    marginLeft: 'auto',
                }}
            />
            <Button type="text" onClick={handleClose} icon={<X className="w-5 h-5" />} />
        </Flex>
    );
};

export default Header;
