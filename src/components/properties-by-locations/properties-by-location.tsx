import { Typography } from 'antd';
import Image from 'next/image';
import Link from 'next/link';

const PropertiesByLocation = ({ src, title, href }: { src: string; title: string; href: string }) => {
    return (
        <Link href={href} className="mb-8 block h-[150px] relative rounded overflow-hidden">
            <Image alt={title} src={src} height={150} width={150} className="w-auto h-auto object-cover" />
            <Typography.Title
                level={4}
                style={{
                    color: 'white',
                }}
                className="text-center absolute bottom-4 px-4 w-full"
            >
                {title}
            </Typography.Title>
        </Link>
    );
};

export default PropertiesByLocation;
