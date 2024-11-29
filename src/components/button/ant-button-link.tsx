'use client';

import { Button, ButtonProps } from 'antd';
import { useRouter } from 'next/navigation';

const AntButtonLink = ({ href, ...props }: ButtonProps) => {
    const router = useRouter();

    const handleLink = () => {
        href && router.push(href);
    };

    return <Button {...props} onClick={handleLink} />;
};

export default AntButtonLink;
