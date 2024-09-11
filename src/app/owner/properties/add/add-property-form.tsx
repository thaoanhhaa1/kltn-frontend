'use client';

import ArticleInfoForm from '@/app/owner/properties/add/article-info-form';
import BasicInfoForm from '@/app/owner/properties/add/basic-info-form';
import ImagesForm from '@/app/owner/properties/add/images-form';
import PropertyInfoForm from '@/app/owner/properties/add/property-info-form';
import { Card } from '@/components/ui/card';
import { OWNER_PROPERTIES } from '@/path';
import { createProperty } from '@/services/property-service';
import { Button, Collapse, CollapseProps, Flex, Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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

const AddPropertyForm = () => {
    const router = useRouter();
    const [form] = useForm<IPropertyForm>();
    const [addressName, setAddressName] = useState<IAddressName>({
        city: '',
        district: '',
        ward: '',
    } as IAddressName);
    const [loading, setLoading] = useState<boolean>(false);

    const basicInfoItems: CollapseProps['items'] = [
        {
            key: '1',
            label: 'Thông tin cơ bản',
            children: <BasicInfoForm form={form} setAddressName={setAddressName} />,
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
            children: <PropertyInfoForm />,
        },
    ];
    const imagesItems: CollapseProps['items'] = [
        {
            key: '1',
            label: 'Ảnh & Video',
            children: <ImagesForm />,
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

        if (acreage)
            conditions.push({
                type: 'Diện tích',
                value: `${acreage} m2`,
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
                type: 'Tầng',
                value: `${floor}`,
            });
        if (interior)
            conditions.push({
                type: 'Nội thất',
                value: `${interior}`,
            });

        // latitude, longitude
        const { images, ...rest } = {
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

        fileList.forEach((file) => {
            if (file.originFileObj) formData.append('images', file.originFileObj);
        });

        formData.append('conditions', JSON.stringify(conditions));

        try {
            await createProperty(formData);

            router.push(OWNER_PROPERTIES);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

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
                    Đăng tin
                </Button>
            </Flex>
        </Form>
    );
};

export default AddPropertyForm;
