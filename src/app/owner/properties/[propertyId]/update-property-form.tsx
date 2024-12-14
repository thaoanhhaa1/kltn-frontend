'use client';

import ArticleInfoForm from '@/app/owner/properties/[propertyId]/article-info-form';
import BasicInfoForm from '@/app/owner/properties/[propertyId]/basic-info-form';
import ImagesForm from '@/app/owner/properties/[propertyId]/images-form';
import PropertyInfoForm from '@/app/owner/properties/[propertyId]/property-info-form';
import { Card } from '@/components/ui/card';
import { IAttributeCbb } from '@/interfaces/attribute';
import { IProperty } from '@/interfaces/property';
import { IPropertyType } from '@/interfaces/property-type';
import { IAddress } from '@/services/address-service';
import { updateProperty } from '@/services/property-service';
import { Button, Collapse, CollapseProps, Flex, Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

export interface IPropertyForm {
    city: string;
    district: string;
    ward: string;
    street: string;
    title: string;
    description: string;
    acreage: number;
    price: number;
    interior: string;
    bedroom: number;
    bathroom: number;
    landArea: number;
    type: string;
    floor: number;
    deposit: number;
    minDuration: number;
    attributeIds: Array<string>;
    images: UploadChangeParam<UploadFile<any>>;
}

export interface IAddressName {
    city: string;
    district: string;
    ward: string;
}

export interface IUpdatePropertyFormProps {
    property: IProperty;
    cities: Array<IAddress>;
    districts: Array<IAddress>;
    wards: Array<IAddress>;
    attributes: Array<IAttributeCbb>;
    propertyTypes: Array<IPropertyType>;
}

const UpdatePropertyForm = ({
    property,
    cities,
    districts,
    wards,
    attributes,
    propertyTypes,
}: IUpdatePropertyFormProps) => {
    const router = useRouter();
    const [form] = useForm<IPropertyForm>();
    const [addressName, setAddressName] = useState<IAddressName>(property.address as IAddressName);
    const [loading, setLoading] = useState<boolean>(false);
    const [type, setType] = useState<IPropertyType | undefined>();
    const addressId = useMemo(() => {
        return {
            city: cities.find((city) => city.name === property.address.city)?._id || '',
            district: districts.find((district) => district.name === property.address.district)?._id || '',
            ward: wards.find((ward) => ward.name === property.address.ward)?._id || '',
        };
    }, [cities, districts, property.address.city, property.address.district, property.address.ward, wards]);

    const basicInfoItems: CollapseProps['items'] = [
        {
            key: '1',
            label: 'Thông tin cơ bản',
            children: (
                <BasicInfoForm
                    cities={cities}
                    districts={districts}
                    wards={wards}
                    form={form}
                    setAddressName={setAddressName}
                    latitude={property.latitude}
                    longitude={property.longitude}
                />
            ),
        },
    ];
    const articleInfoItems: CollapseProps['items'] = [
        {
            key: '1',
            label: 'Thông tin bài viết',
            children: <ArticleInfoForm />,
        },
    ];
    const propertyInfoItems: CollapseProps['items'] = [
        {
            key: '1',
            label: 'Thông tin bất động sản',
            children: <PropertyInfoForm propertyTypes={propertyTypes} setType={setType} attributes={attributes} />,
        },
    ];
    const imagesItems: CollapseProps['items'] = [
        {
            key: '1',
            label: 'Ảnh & Video',
            children: <ImagesForm images={property.images} />,
        },
    ];

    const handleFinish = async (values: IPropertyForm) => {
        setLoading(true);

        const conditions: Array<{
            type: string;
            value: string;
        }> = [];

        const acreage = values.acreage;
        const bathroom = values.bathroom;
        const bedroom = values.bedroom;
        const floor = values.floor;
        const interior = values.interior;
        const landArea = values.landArea;

        if (acreage)
            conditions.push({
                type: 'Diện tích',
                value: `${acreage} m2`,
            });
        if (landArea)
            conditions.push({
                type: 'Diện tích quyền sử dụng đất',
                value: `${landArea} m2`,
            });
        if (bathroom)
            conditions.push({
                type: 'Phòng tắm',
                value: `${bathroom} phòng`,
            });
        if (bedroom)
            conditions.push({
                type: 'Phòng ngủ',
                value: `${bedroom} phòng`,
            });
        if (floor)
            conditions.push({
                type: 'Số tầng',
                value: `${floor} tầng`,
            });
        if (interior)
            conditions.push({
                type: 'Nội thất',
                value: `${interior}`,
            });

        // latitude, longitude
        const {
            images,
            type: _,
            ...rest
        } = {
            ...values,
            ...addressName,
        };

        const formData = new FormData();

        Object.entries(rest).forEach(([key, value]) => {
            if (key === 'attributeIds' && Array.isArray(value))
                (value as string[]).forEach((attributeId) => {
                    formData.append('attributeIds[]', attributeId);
                });
            else if (value) formData.append(key, value as string);
        });

        const { fileList } = images;
        const imageUrls: string[] = [];

        fileList.forEach((file) => {
            if (file.originFileObj) formData.append('images', file.originFileObj);
            else if (file.url) imageUrls.push(file.url);
        });

        formData.append('conditions', JSON.stringify(conditions));
        formData.append('type', JSON.stringify(type || property.type));
        formData.append('imageUrls', JSON.stringify(imageUrls));

        try {
            await updateProperty(property.propertyId, formData);

            router.refresh();
            toast.success('Cập nhật bất động sản thành công');
        } catch (error) {
            console.error(error);
            toast.error((error as Error)?.message || 'Cập nhật bất động sản thất bại');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const conditions = property.rentalConditions.reduce((acc, cur) => {
            switch (cur.type) {
                case 'Diện tích':
                    return {
                        ...acc,
                        acreage: (cur.value || '').replace(' m2', ''),
                    };
                case 'Diện tích quyền sử dụng đất':
                    return {
                        ...acc,
                        landArea: (cur.value || '').replace(' m2', ''),
                    };
                case 'Số tầng':
                    return {
                        ...acc,
                        floor: (cur.value || '').replace(' tầng', ''),
                    };
                case 'Phòng tắm':
                    return {
                        ...acc,
                        bathroom: (cur.value || '').replace(' phòng', ''),
                    };
                case 'Phòng ngủ':
                    return {
                        ...acc,
                        bedroom: (cur.value || '').replace(' phòng', ''),
                    };
                case 'Nội thất':
                    return {
                        ...acc,
                        interior: cur.value,
                    };
                default:
                    return acc;
            }
        }, {});

        const attributeIds = property.attributes
            .map((attribute) => attributes.find((attr) => attr.name === attribute.name)?.id)
            .filter(Boolean) as string[];

        form.setFieldsValue({
            ...conditions,
            ...addressId,
            street: property.address.street,
            title: property.title,
            description: property.description,
            type: property.type.id,
            price: property.price,
            deposit: property.deposit,
            minDuration: property.minDuration,
            attributeIds,
            images: {
                fileList:
                    property.images.map(
                        (media) =>
                            ({
                                uid: media,
                                status: 'done',
                                url: media,
                            } as UploadFile),
                    ) || [],
            },
        });
    }, [
        addressId,
        attributes,
        form,
        property.address.street,
        property.attributes,
        property.deposit,
        property.description,
        property.images,
        property.minDuration,
        property.price,
        property.rentalConditions,
        property.title,
        property.type.id,
    ]);

    return (
        <Form onFinish={handleFinish} layout="vertical" form={form}>
            <Flex gap={24} vertical className="mt-6">
                <Card>
                    <Collapse defaultActiveKey={['1']} items={basicInfoItems} />
                </Card>
                <Card>
                    <Collapse defaultActiveKey={['1']} items={articleInfoItems} />
                </Card>
                <Card>
                    <Collapse defaultActiveKey={['1']} items={propertyInfoItems} />
                </Card>
                <Card>
                    <Collapse defaultActiveKey={['1']} items={imagesItems} />
                </Card>
                <Button loading={loading} htmlType="submit" type="primary" size="large">
                    Cập nhật
                </Button>
            </Flex>
        </Form>
    );
};

export default UpdatePropertyForm;
