'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

const HeaderItem = ({ link, icon, title }: { link: string; title: string; icon: ReactNode }) => {
    const pathname = usePathname();
    const isActive = pathname === link;

    return (
        <Link
            href={link}
            className={cn(
                'flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground',
                isActive && 'text-foreground',
            )}
        >
            {icon}
            {title}
        </Link>
    );
};

export default HeaderItem;
