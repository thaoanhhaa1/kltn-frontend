import { IProperty } from '@/interfaces/property';
import { Typography } from 'antd';
import Image from 'next/image';
import Link from 'next/link';

const ChatProperty = ({ property }: { property: IProperty }) => {
    return (
        <Link href={`/${property.slug}`} className="flex gap-2">
            <Image
                alt={property.title}
                src={property.images[0]}
                width={100}
                height={250}
                className="w-[100px] h-[150px] object-cover flex-shrink-0 rounded-md"
            />
            <div>
                <Typography.Title level={5} className="text-lg font-semibold line-clamp-2">
                    {property.title}
                </Typography.Title>
                <Typography.Text className="text-sm line-clamp-3">{property.description}</Typography.Text>
            </div>
        </Link>
    );
};

export default ChatProperty;
