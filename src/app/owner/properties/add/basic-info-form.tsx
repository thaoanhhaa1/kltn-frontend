'use client';

import { IAddressName, IPropertyForm } from '@/app/owner/properties/add/add-property-form';
import { getCities, getDistricts, getWards, IAddress } from '@/services/address-service';
import { Col, Form, FormInstance, Input, Row, Select } from 'antd';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

const selectProps = {
    fieldNames: {
        label: 'name',
        value: '_id',
    },
    showSearch: true,
    optionFilterProp: 'name',
};

const BasicInfoForm = ({
    form,
    setAddressName,
}: {
    form: FormInstance<IPropertyForm>;
    setAddressName: Dispatch<SetStateAction<IAddressName>>;
}) => {
    const [cities, setCities] = useState<Array<IAddress>>([]);
    const [cityLoading, setCityLoading] = useState<boolean>(false);
    const [districts, setDistricts] = useState<Array<IAddress>>([]);
    const [distinctLoading, setDistinctLoading] = useState<boolean>(false);
    const [wards, setWards] = useState<Array<IAddress>>([]);
    const [wardLoading, setWardLoading] = useState<boolean>(false);

    const handleCityChange = async (cityId: string) => {
        form.setFieldsValue({
            district: undefined,
            ward: undefined,
        });

        setDistinctLoading(true);

        const districts = await getDistricts(cityId);

        setDistricts(districts);
        setDistinctLoading(false);
    };

    const handleDistrictChange = async (districtId: string) => {
        form.setFieldsValue({
            ward: undefined,
        });

        setWardLoading(true);

        const wards = await getWards(districtId);

        setWards(wards);
        setWardLoading(false);
    };

    const handleWardChange = (wardId: string) => {
        const city = cities.find((city) => city._id === form.getFieldValue('city'));
        const district = districts.find((district) => district._id === form.getFieldValue('district'));
        const ward = wards.find((ward) => ward._id === wardId);

        setAddressName({
            city: city?.name || '',
            district: district?.name || '',
            ward: ward?.name || '',
        });
    };

    useEffect(() => {
        const fetchCities = async () => {
            setCityLoading(true);
            const cities = await getCities();
            setCities(cities);

            setCityLoading(false);
        };

        fetchCities();
    }, []);

    return (
        <div>
            <Row gutter={12}>
                <Col span={12}>
                    <Row gutter={12}>
                        <Col span={8}>
                            <Form.Item
                                label="Tỉnh, thành phố"
                                name="city"
                                rules={[{ required: true, message: 'Vui lòng chọn tỉnh, thành phố' }]}
                            >
                                <Select
                                    loading={cityLoading}
                                    options={cities}
                                    {...selectProps}
                                    onChange={handleCityChange}
                                    placeholder="Chọn tỉnh, thành phố"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Quận, huyện"
                                name="district"
                                rules={[{ required: true, message: 'Vui lòng chọn quận, huyện' }]}
                            >
                                <Select
                                    loading={distinctLoading}
                                    options={districts}
                                    {...selectProps}
                                    onChange={handleDistrictChange}
                                    placeholder="Chọn quận, huyện"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Phường, xã"
                                name="ward"
                                rules={[{ required: true, message: 'Vui lòng chọn phường, xã' }]}
                            >
                                <Select
                                    loading={wardLoading}
                                    options={wards}
                                    {...selectProps}
                                    placeholder="Chọn phường, xã"
                                    onChange={handleWardChange}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="Địa chỉ"
                                name="street"
                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                            >
                                <Input placeholder="Vui lòng nhập địa chỉ" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default BasicInfoForm;
