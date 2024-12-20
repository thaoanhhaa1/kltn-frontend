import BaseInfo from '@/app/(base)/[slug]/base-info';
import DetailInfo from '@/app/(base)/[slug]/detail-info';
import Map from '@/app/(base)/[slug]/map';
import ReviewProperty from '@/app/(base)/[slug]/review';
import { baseOpenGraph } from '@/app/shared-metadata';
import AntButtonLink from '@/components/button/ant-button-link';
import Rating from '@/components/rating';
import Text from '@/components/text';
import Title from '@/components/title';
import { envConfig } from '@/config/envConfig';
import { IProperty } from '@/interfaces/property';
import { HOME } from '@/path';
import { getPropertyBySlug } from '@/services/property-service';
import { Col, Flex, Image, Result, Row } from 'antd';
import { Metadata } from 'next';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const slug = params.slug;

    let property = null;

    try {
        property = await getPropertyBySlug(slug);
    } catch (error) {}

    const title = property?.title || 'Không tìm thấy bất động sản';
    const description = property?.description || 'Không tìm thấy bất động sản';
    const url = `${envConfig.NEXT_PUBLIC_URL}/${slug}`;

    return {
        title,
        description,
        openGraph: {
            ...baseOpenGraph,
            title,
            description,
            url,
            images: [{ url: property?.images[0] || '' }],
        },
        alternates: { canonical: url },
    };
}

const PropertyDetailPage = async ({ params: { slug } }: Props) => {
    let property: IProperty | undefined;

    try {
        property = await getPropertyBySlug(slug);
    } catch (error) {
        console.error(error);
    }

    if (!property) {
        return (
            <Result
                status="404"
                title="404"
                subTitle="Xin lỗi, bất động sản bạn đang tìm kiếm không tồn tại."
                extra={
                    <AntButtonLink href={HOME} type="primary">
                        Trang chủ
                    </AntButtonLink>
                }
            />
        );
    }

    const [image, ...restImages] = property.images;

    return (
        <div className="mt-10 pb-6">
            <Row gutter={24}>
                <Col span={12}>
                    <Image
                        alt={property.title}
                        src={image}
                        height={500}
                        width={500}
                        className="w-full aspect-square object-cover rounded-lg"
                    />
                </Col>
                <Col span={12}>
                    <BaseInfo property={property} />
                </Col>
            </Row>
            <div>
                {restImages.length > 0 && (
                    <div className="w-full">
                        <div className="swipe-container">
                            {restImages.map((img, index) => (
                                <div className="swipe-item" key={index}>
                                    <Image
                                        rootClassName="w-full h-full"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                        alt={property.title}
                                        src={img}
                                        className="rounded-lg"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <DetailInfo property={property} />
            {property.latitude != null && property.longitude != null && (
                <Title
                    style={{
                        marginTop: '0px',
                        marginBottom: '15px',
                    }}
                    level={2}
                >
                    Vị trí
                </Title>
            )}
            {property.latitude != null && property.longitude != null && (
                <Map latitude={property.latitude} longitude={property.longitude} />
            )}
            <Flex gap={20} align="center">
                <Title
                    style={{
                        marginTop: '0px',
                    }}
                    level={2}
                >
                    Đánh giá
                </Title>
                {property.ratingCount > 0 && property.rating > 0 && (
                    <Flex align="center">
                        <Rating rating={property.rating / 2} />
                        <Text style={{ marginLeft: '8px' }}>Có {property.ratingCount} đánh giá</Text>
                    </Flex>
                )}
            </Flex>
            <ReviewProperty ownerId={property.owner.userId} propertyId={property.propertyId} slug={slug} />
        </div>
    );
};

export default PropertyDetailPage;
