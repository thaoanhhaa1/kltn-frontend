'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button, Flex } from 'antd';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { ReactNode, useState } from 'react';

const FormPopover = ({
    className = '',
    title,
    children,
    onReset = () => {},
}: {
    className?: string;
    title: string;
    children: ReactNode;
    onReset?: () => void;
}) => {
    const [open, setOpen] = useState(false);

    const handleApply = () => setOpen(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className={className}>
                <div className="flex justify-between items-center gap-1 h-10 py-2 px-4 border border-[#ecedf1] text-[#646d84] bg-[#ecedf1] rounded-full">
                    <span className="line-clamp-1">{title}</span>
                    <ChevronDown className="w-5 h-5" />
                </div>
            </PopoverTrigger>
            <PopoverContent>
                <Flex gap={8} vertical>
                    <div>{children}</div>
                    <Flex justify="space-between">
                        <Button icon={<RotateCcw className="w-4 h-4" />} type="text" onClick={onReset}>
                            Reset
                        </Button>
                        <Button onClick={handleApply} type="primary">
                            Apply
                        </Button>
                    </Flex>
                </Flex>
            </PopoverContent>
        </Popover>
    );
};

export default FormPopover;
