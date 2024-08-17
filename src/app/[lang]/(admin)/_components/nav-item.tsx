'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

const NavItem = ({ link, icon, title }: { link: string; title: string; icon: ReactNode }) => {
    const pathname = usePathname();
    const isActive = pathname === link;

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Link
                    href={link}
                    className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8',
                        isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
                    )}
                >
                    {icon}
                    <span className="sr-only">{title}</span>
                </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{title}</TooltipContent>
        </Tooltip>
    );
};

export default NavItem;
