import HeartBtn from '@/components/property/heart-btn';
import { ICondition, IProperty } from '@/interfaces/property';
import { convertDateToTimeAgo, formatCurrency } from '@/lib/utils';
import { Flex, Typography } from 'antd';
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
                    <Typography.Title level={4}>{property.title}</Typography.Title>
                    <Typography.Paragraph className="line-clamp-3 whitespace-pre-wrap" type="secondary">
                        {property.description}
                    </Typography.Paragraph>
                    <Typography.Text>
                        {property.address.district}, {property.address.city}
                    </Typography.Text>
                    <Flex gap={24} className="mt-5">
                        <Typography.Title className="!mt-0" level={5}>
                            {acreage.replace('m2', '')} m²
                        </Typography.Title>
                        {bedroom && (
                            <Typography.Title className="!mt-0" level={5}>
                                {bedroom} phòng ngủ
                            </Typography.Title>
                        )}
                        {bathroom && (
                            <Typography.Title className="!mt-0" level={5}>
                                {bathroom} phòng tắm
                            </Typography.Title>
                        )}
                    </Flex>
                    <Typography.Title type="danger" level={4}>
                        {formatCurrency(property.price, true)}
                    </Typography.Title>
                    <Flex align="center" justify="space-between">
                        <Typography.Text type="secondary">
                            {convertDateToTimeAgo(new Date(property.createdAt))}
                        </Typography.Text>
                        <HeartBtn />
                    </Flex>
                </div>
            </Flex>
        </Link>
    );
};

export default HorizontalProperty;
