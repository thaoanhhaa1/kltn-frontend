import Link from 'next/link';
import { ReactNode } from 'react';

const ButtonLink = ({ children, href }: { href: string; children: ReactNode }) => {
    return (
        <Link className="flex w-8 h-8 justify-center items-center text-[rgba(0,_0,_0,_0.88)]" href={href}>
            {children}
        </Link>
    );
};

export default ButtonLink;
