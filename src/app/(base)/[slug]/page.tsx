import BaseInfo from '@/app/(base)/[slug]/base-info';
import DetailInfo from '@/app/(base)/[slug]/detail-info';
import Rating from '@/components/rating';
import Review from '@/components/review/review';
import Text from '@/components/text';
import Title from '@/components/title';
import { IProperty } from '@/interfaces/property';
import { IReview } from '@/interfaces/review';
import { HOME } from '@/path';
import { getPropertyBySlug } from '@/services/property-service';
import { getReviewsBySlug } from '@/services/review-service';
import { Button, Col, Empty, Flex, Result, Row } from 'antd';
import Image from 'next/image';

const PropertyDetailPage = async ({ params: { slug } }: { params: { slug: string } }) => {
    let property: IProperty | undefined;
    let reviews: IReview[] | undefined;

    try {
        [property, reviews] = await Promise.all([getPropertyBySlug(slug), getReviewsBySlug(slug)]);
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
                    <Button href={HOME} type="primary">
                        Trang chủ
                    </Button>
                }
            />
        );
    }

    return (
        <div className="mt-10 pb-6">
            <Row gutter={24}>
                <Col span={12}>
                    <Image
                        alt={property.title}
                        src={property.images[0]}
                        height={500}
                        width={500}
                        className="w-full aspect-square object-cover rounded-lg"
                    />
                </Col>
                <Col span={12}>
                    <BaseInfo property={property} />
                </Col>
            </Row>
            <DetailInfo property={property} />
            <Flex gap={20} align="center">
                <Title
                    style={{
                        marginTop: '0px',
                    }}
                    level={2}
                >
                    Đánh giá
                </Title>
                {property.ratingCount && property.rating && (
                    <Flex align="center">
                        <Rating rating={property.rating / 2} />
                        <Text style={{ marginLeft: '8px' }}>Có {property.ratingCount} đánh giá</Text>
                    </Flex>
                )}
            </Flex>
            {!reviews?.length && <Empty description="Chưa có đánh giá" />}
            {reviews?.map((review) => (
                <Review
                    key={review.id}
                    review={review}
                    ownerId={property.owner.userId}
                    propertyId={property.propertyId}
                />
            ))}
        </div>
    );
};

export default PropertyDetailPage;
