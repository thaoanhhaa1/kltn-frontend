import Paragraph from '@/components/paragraph';
import HeartBtn from '@/components/property/heart-btn';
import Title from '@/components/title';
import { IProperty } from '@/interfaces/property';
import { formatAddress, formatCurrency } from '@/lib/utils';
import { Flex, Tag } from 'antd';
import Image from 'next/image';
import Link from 'next/link';

const VerticalProperty = ({ property }: { property: IProperty }) => {
    return (
        <Link
            href={`/${property.slug}`}
            className="relative flex-shrink-0 rounded-lg w-[200px] touch-pan-x shadow-md select-none snap-center"
        >
            <Image
                alt={property.title}
                src={property.images[0]}
                width={200}
                height={150}
                className="w-[200px] h-[150px] object-cover select-none rounded-t-lg"
            />
            <Flex className="p-2" vertical gap={8}>
                <Title level={5} className="line-clamp-1 mt-2 select-none">
                    {property.title}
                </Title>
                <Paragraph className="line-clamp-1 whitespace-pre-wrap select-none !mb-0" type="secondary">
                    {formatAddress(property.address)}
                </Paragraph>
                <Title type="danger" level={4}>
                    {formatCurrency(property.price, true)}
                </Title>
                <Tag color="cyan" bordered={false} className="!text-center">
                    {property.type.name}
                </Tag>
            </Flex>
            <div className="absolute right-2 top-2">
                <HeartBtn propertyId={property.propertyId} isFavorite={property.isFavorite} />
            </div>
        </Link>
    );
};

export default VerticalProperty;
