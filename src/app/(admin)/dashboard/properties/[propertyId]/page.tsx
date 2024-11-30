import BaseInfo from '@/app/(admin)/dashboard/properties/[propertyId]/base-info';
import DetailInfo from '@/app/(admin)/dashboard/properties/[propertyId]/detail-info';
import PropertyDetailBreadcrumb from '@/app/(admin)/dashboard/properties/[propertyId]/property-detail-breadcrumb';
import Map from '@/app/(base)/[slug]/map';
import AntButtonLink from '@/components/button/ant-button-link';
import Title from '@/components/title';
import { IProperty } from '@/interfaces/property';
import { IRejectReason } from '@/interfaces/reject-reason';
import { DASHBOARD_PROPERTIES } from '@/path';
import { getNotDeletedPropertyService } from '@/services/property-service';
import { getRejectReasonsByPropertyIdService } from '@/services/reject-reason-service';
import { Col, Image, Result, Row } from 'antd';
import { cookies } from 'next/headers';

type Props = { params: { propertyId: string } };

const PropertyDetailPage = async ({ params: { propertyId } }: Props) => {
    const cookiesStore = cookies();
    const accessToken = cookiesStore.get('accessToken')?.value;

    let property: IProperty | undefined;
    let rejectReason: IRejectReason[] = [];

    try {
        [property, rejectReason] = await Promise.all([
            getNotDeletedPropertyService(propertyId, accessToken!),
            getRejectReasonsByPropertyIdService(propertyId, accessToken!),
        ]);
    } catch (error) {}

    if (!property) {
        return (
            <Result
                status="404"
                title="404"
                subTitle="Xin lỗi, bất động sản không tồn tại."
                extra={
                    <AntButtonLink href={DASHBOARD_PROPERTIES} type="primary">
                        Bất động sản
                    </AntButtonLink>
                }
            />
        );
    }

    const [image, ...restImages] = property.images;

    return (
        <div>
            <PropertyDetailBreadcrumb />
            <Row gutter={24}>
                <Col span={12}>
                    <Image
                        wrapperStyle={{
                            width: '100%',
                        }}
                        alt={property.title}
                        src={image}
                        height={500}
                        width={500}
                        className="w-full aspect-square object-cover rounded-lg"
                    />
                </Col>
                <Col span={12}>
                    <BaseInfo property={property} rejectReasons={rejectReason} />
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
        </div>
    );
};

export default PropertyDetailPage;
