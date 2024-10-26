import Paragraph from '@/components/paragraph';
import HeartBtn from '@/components/property/heart-btn';
import Rating from '@/components/rating';
import Text from '@/components/text';
import Title from '@/components/title';
import { ICondition, IProperty } from '@/interfaces/property';
import { convertDateToTimeAgo, formatCurrency } from '@/lib/utils';
import { Flex } from 'antd';
import Image from 'next/image';
import Link from 'next/link';

const findByConditionType = (conditions: Array<ICondition>, type: string) => {
    return conditions.find((condition) => condition.type === type)?.value || '';
};

const HorizontalProperty = ({ property }: { property: IProperty }) => {
    const acreage = findByConditionType(property.rentalConditions, 'Diện tích');
    const bedroom = findByConditionType(property.rentalConditions, 'Phòng ngủ');
    const bathroom = findByConditionType(property.rentalConditions, 'Phòng tắm');

    return (
        <Link href={`/${property.slug}`} className="rounded-md shadow-lg border-t">
            <Flex className="rounded-md overflow-hidden">
                <Image
                    alt={property.title}
                    src={property.images[0]}
                    width={250}
                    height={250}
                    className="aspect-square object-cover w-auto h-auto"
                />
                <div className="p-4 w-full">
                    <Title level={4}>{property.title}</Title>
                    <Paragraph className="line-clamp-3 whitespace-pre-wrap" type="secondary">
                        {property.description}
                    </Paragraph>
                    <Text>
                        {property.address.district}, {property.address.city}
                    </Text>
                    <Flex gap={24} className="mt-5">
                        <Title className="!mt-0" level={5}>
                            {acreage.replace('m2', '')} m²
                        </Title>
                        {bedroom && (
                            <Title className="!mt-0" level={5}>
                                {bedroom} ngủ
                            </Title>
                        )}
                        {bathroom && (
                            <Title className="!mt-0" level={5}>
                                {bathroom} tắm
                            </Title>
                        )}
                    </Flex>
                    <Title type="danger" level={4}>
                        {formatCurrency(property.price, true)}
                    </Title>
                    <Rating rating={property.rating / 2} />
                    <Flex align="center" justify="space-between">
                        <Text type="secondary">{convertDateToTimeAgo(new Date(property.createdAt))}</Text>
                        <HeartBtn />
                    </Flex>
                </div>
            </Flex>
        </Link>
    );
};

export default HorizontalProperty;
