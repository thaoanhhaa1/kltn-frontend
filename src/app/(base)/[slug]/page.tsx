import BaseInfo from '@/app/(base)/[slug]/base-info';
import DetailInfo from '@/app/(base)/[slug]/detail-info';
import { IProperty } from '@/interfaces/property';
import { HOME } from '@/path';
import { getPropertyBySlug } from '@/services/property-service';
import { Button, Col, Result, Row } from 'antd';
import Image from 'next/image';

// TODO: Implement PropertyDetailPage
const PropertyDetailPage = async ({ params: { slug } }: { params: { slug: string } }) => {
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
                    <Button href={HOME} type="primary">
                        Trang chủ
                    </Button>
                }
            />
        );
    }

    return (
        <div className="mt-10">
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
        </div>
    );
};

export default PropertyDetailPage;
