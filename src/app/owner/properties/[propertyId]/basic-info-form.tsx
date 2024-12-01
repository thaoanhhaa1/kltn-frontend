'use client';

import { IAddressName, IPropertyForm } from '@/app/owner/properties/add/add-property-form';
import { IViewPort } from '@/app/owner/properties/add/basic-info-form';
import ErrorComponent from '@/components/error-component';
import GoongMap from '@/components/goong-map';
import useDebounce from '@/hooks/useDebounce';
import { getDistricts, getWards, IAddress } from '@/services/address-service';
import { addressToLngLatService, lngLatToAddressService } from '@/services/goong-service';
import { Button, Col, Form, FormInstance, Input, Row, Select, Spin } from 'antd';
import { LocateIcon } from 'lucide-react';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';

export interface IAddressId {
    city: string;
    district: string;
    ward: string;
}

const selectProps = {
    fieldNames: {
        label: 'name',
        value: '_id',
    },
    showSearch: true,
    optionFilterProp: 'name',
};

const BasicInfoForm = ({
    latitude,
    longitude,
    cities: citiesProp,
    districts: districtsProp,
    wards: wardsProp,
    form,
    setAddressName,
}: {
    cities: Array<IAddress>;
    districts: Array<IAddress>;
    wards: Array<IAddress>;
    latitude?: number;
    longitude?: number;
    form: FormInstance<IPropertyForm>;
    setAddressName: Dispatch<SetStateAction<IAddressName>>;
}) => {
    const cities = useMemo(() => citiesProp, [citiesProp]);
    const [districts, setDistricts] = useState<Array<IAddress>>(districtsProp);
    const [distinctLoading, setDistinctLoading] = useState<boolean>(false);
    const [wards, setWards] = useState<Array<IAddress>>(wardsProp);
    const [wardLoading, setWardLoading] = useState<boolean>(false);
    const [viewport, setViewport] = useState<IViewPort>({
        latitude: latitude ?? 21.03072,
        longitude: longitude ?? 105.85239,
        zoom: 15,
    });
    const [mapLoaded, setMapLoaded] = useState<boolean>(false);
    const [marker, setMarker] = useState<[number, number] | null>(null);
    const [street, setStreet] = useState<string>('');
    const streetDebounce = useDebounce(street, 500);
    const isChangeAddress = useRef<boolean>(false);
    const isChangeMarker = useRef<boolean>(false);

    const getMyLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setViewport({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        zoom: 15,
                    });
                    handleChangeMarker([position.coords.longitude, position.coords.latitude]);
                },
                (err) => {
                    console.error(err);
                    toast.error('Không thể lấy vị trí của bạn');
                },
            );
        } else {
            toast.error('Vị trí của bạn không được hỗ trợ bởi trình duyệt của bạn');
        }
    };

    const handleChangeMarker = async (data: [number, number]) => {
        console.log('🚀 ~ handleChangeMarker ~ data:', data);
        isChangeMarker.current = true;
        setMarker(data);

        const [lng, lat] = data;

        const res = await lngLatToAddressService([lat, lng]);

        const address = res.results.find((r) => r.address_components.length > 3);

        if (!address) {
            return;
        }

        const addressComponents = address.address_components;

        const addressComponentsDesc = addressComponents.reverse();
        const [city, district, ward, ...restAddress] = addressComponentsDesc;

        const cityFind = cities.find((c) => c.name.toLowerCase().includes(city.short_name.toLowerCase()));
        const cityId = cityFind?._id;
        form.setFieldValue('city', cityId);

        if (!cityId) {
            return;
        }

        const districts = await handleCityChange(cityId);
        console.log('district.short_name', district.short_name);

        const districtFind = districts.find((d) => d.name.toLowerCase().includes(district.short_name.toLowerCase()));
        const districtId = districtFind?._id;
        form.setFieldValue('district', districtId);

        if (!districtId) {
            return;
        }
        const wards = await handleDistrictChange(districtId);
        console.log('ward.short_name', ward.short_name);

        const wardFind = wards.find((w) => w.name.toLowerCase().includes(ward.short_name.toLowerCase()));
        const wardId = wardFind?._id;
        form.setFieldValue('ward', wardId);

        if (!wardId) {
            return;
        }
        handleWardChange(wardId);

        form.setFieldValue('street', restAddress.map((a) => a.short_name).join(' '));
        setStreet(restAddress.map((a) => a.short_name).join(' '));
        setAddressName({
            latitude: data[1],
            longitude: data[0],
            city: cityFind.name,
            district: districtFind.name,
            ward: wardFind.name,
        });
    };

    const handleCityChange = useCallback(
        async (cityId: string) => {
            isChangeAddress.current = true;
            const cityName = cities.find((city) => city._id === cityId)?.name;
            console.log('🚀 ~ cityName:', cityName);

            console.log(isChangeMarker.current);

            isChangeMarker.current ||
                addressToLngLatService(cityName!).then((res) => {
                    const { lat, lng } = res.results[0].geometry.location;
                    setMarker([lng, lat]);
                    setAddressName((prev) => ({
                        ...prev,
                        latitude: lat,
                        longitude: lng,
                    }));
                    setViewport((prev) => ({ ...prev, latitude: lat, longitude: lng }));
                });

            form.setFieldsValue({
                district: undefined,
                ward: undefined,
            });

            setDistinctLoading(true);

            const districts = await getDistricts(cityId);

            setDistricts(districts);
            setDistinctLoading(false);
            return districts;
        },
        [cities, form, setAddressName],
    );

    const handleDistrictChange = useCallback(
        async (districtId: string) => {
            isChangeAddress.current = true;
            const cityId = form.getFieldValue('city');

            const cityName = cities.find((city) => city._id === cityId)?.name;
            const districtName = districts.find((district) => district._id === districtId)?.name;

            isChangeMarker.current ||
                addressToLngLatService(`${districtName}, ${cityName}`).then((res) => {
                    const { lat, lng } = res.results[0].geometry.location;
                    setMarker([lng, lat]);
                    setAddressName((prev) => ({
                        ...prev,
                        latitude: lat,
                        longitude: lng,
                    }));
                    setViewport((prev) => ({ ...prev, latitude: lat, longitude: lng }));
                });

            form.setFieldsValue({
                ward: undefined,
            });

            setWardLoading(true);

            const wards = await getWards(districtId);

            setWards(wards);
            setWardLoading(false);
            return wards;
        },
        [cities, districts, form, setAddressName],
    );

    const handleWardChange = useCallback(
        (wardId: string) => {
            isChangeAddress.current = true;

            const city = cities.find((city) => city._id === form.getFieldValue('city'));
            const district = districts.find((district) => district._id === form.getFieldValue('district'));
            const ward = wards.find((ward) => ward._id === wardId);

            isChangeMarker.current ||
                addressToLngLatService(`${ward}, ${district?.name}, ${city?.name}`).then((res) => {
                    const { lat, lng } = res.results[0].geometry.location;
                    setMarker([lng, lat]);
                    setAddressName((prev) => ({
                        ...prev,
                        latitude: lat,
                        longitude: lng,
                    }));
                    setViewport((prev) => ({ ...prev, latitude: lat, longitude: lng }));
                });

            setAddressName((prev) => ({
                ...prev,
                city: city?.name || '',
                district: district?.name || '',
                ward: ward?.name || '',
            }));
        },
        [cities, districts, form, setAddressName, wards],
    );

    const handleChangeStreet = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const street = e.target.value;
        setStreet(street);
    };

    const handleLoadedMap = () => {
        setMapLoaded(true);
    };

    useEffect(() => {
        if (latitude !== undefined && longitude !== undefined && latitude !== null && longitude !== null) {
            setViewport({
                latitude,
                longitude,
                zoom: 15,
            } as IViewPort);
            setMarker([longitude, latitude]);
        }
    }, [latitude, longitude]);

    useEffect(() => {
        if (streetDebounce && !isChangeMarker.current) {
            isChangeAddress.current = true;
            const city = cities.find((city) => city._id === form.getFieldValue('city'));
            const district = districts.find((district) => district._id === form.getFieldValue('district'));
            const ward = wards.find((ward) => ward._id === form.getFieldValue('ward'));

            addressToLngLatService(`${streetDebounce}, ${ward?.name}, ${district?.name}, ${city?.name}`).then((res) => {
                const { lat, lng } = res.results[0].geometry.location;
                setMarker([lng, lat]);
                setAddressName((prev) => ({
                    ...prev,
                    latitude: lat,
                    longitude: lng,
                }));
                setViewport((prev) => ({ ...prev, latitude: lat, longitude: lng }));
            });
        }

        isChangeMarker.current = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [streetDebounce]);

    return (
        <ErrorBoundary errorComponent={ErrorComponent}>
            <Row gutter={[12, 12]}>
                <Col span={8}>
                    <Row gutter={12}>
                        <Col span={24}>
                            <Form.Item
                                label="Tỉnh, thành phố"
                                name="city"
                                rules={[{ required: true, message: 'Vui lòng chọn tỉnh, thành phố' }]}
                            >
                                <Select
                                    options={cities}
                                    {...selectProps}
                                    onChange={handleCityChange}
                                    placeholder="Chọn tỉnh, thành phố"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
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
                        <Col span={24}>
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
                                <Input.TextArea
                                    rows={3}
                                    placeholder="Vui lòng nhập địa chỉ"
                                    onChange={handleChangeStreet}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                <Col
                    span={16}
                    style={{
                        minHeight: '200px',
                    }}
                >
                    <div className="relative w-full h-full">
                        <div className="absolute inset-0">
                            <Button
                                style={{
                                    zIndex: 1,
                                    position: 'absolute',
                                    top: '10px',
                                    left: '10px',
                                }}
                                icon={<LocateIcon className="w-5 h-5" />}
                                onClick={getMyLocation}
                            />
                            <GoongMap
                                marker={marker}
                                // setMarker={setMarker}
                                onChangeMarker={handleChangeMarker}
                                setViewport={setViewport}
                                viewport={viewport}
                                onLoad={handleLoadedMap}
                            />
                        </div>
                        {mapLoaded || (
                            <div className="z-20 absolute inset-0 bg-white bg-opacity-50 flex justify-center items-center">
                                <Spin size="large" />
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </ErrorBoundary>
    );
};

export default BasicInfoForm;
