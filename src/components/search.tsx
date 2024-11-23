'use client';

import FormPopover from '@/components/form-popover';
import PriceInput from '@/components/input/price-input';
import { interiorOptions } from '@/constants/init-data';
import { inputNumberProps, selectProps } from '@/constants/init-props';
import { IAttributeCbb } from '@/interfaces/attribute';
import { IPropertyType } from '@/interfaces/property-type';
import { convertCurrencyToText, convertObjectToParams, formatCurrency } from '@/lib/utils';
import { SEARCH } from '@/path';
import { getCities, getDistricts, getWards, IAddress } from '@/services/address-service';
import { getAllAttributesCbb } from '@/services/attribute-service';
import { getPropertyTypes } from '@/services/property-type';
import { Col, Flex, Form, Input, InputNumber, Row, Select, Slider, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { RotateCcw, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ISearchInput {
    search: string;
}

const getAddress = ({ city, district, ward }: { city: string; district: string; ward: string }) => {
    return `${city}${district ? `, ${district}` : ''}${ward ? `, ${ward}` : ''}`;
};

const getTitleMoreInfo = ({
    type,
    bedroom,
    bathroom,
    furniture,
}: {
    type: string;
    bedroom: number;
    bathroom: number;
    furniture: string;
}) => {
    const res = [];

    if (type) res.push(type);

    if (bedroom) res.push(`${bedroom} ngủ`);

    if (bathroom) res.push(`${bathroom} tắm`);

    if (furniture) res.push(furniture);

    if (res.length === 0) return 'Xem thêm';

    return res.join(', ');
};

const fieldNames = {
    label: 'name',
    value: 'name',
};

const SearchComponent = () => {
    const router = useRouter();
    const [form] = useForm();
    const [cities, setCities] = useState<IAddress[]>([]);
    const [cityLoading, setCityLoading] = useState(false);
    const [districts, setDistricts] = useState<IAddress[]>([]);
    const [distinctLoading, setDistinctLoading] = useState(false);
    const [wards, setWards] = useState<IAddress[]>([]);
    const [wardLoading, setWardLoading] = useState(false);
    const [addressName, setAddressName] = useState({
        city: '',
        district: '',
        ward: '',
    });
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
    console.log('🚀 ~ SearchComponent ~ priceRange:', priceRange);
    const [attributes, setAttributes] = useState<IAttributeCbb[]>([]);
    const [loadingAttributes, setLoadingAttributes] = useState(false);
    const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
    const [types, setTypes] = useState<IPropertyType[]>([]);
    const [typeLoading, setTypeLoading] = useState(false);
    const [moreInfo, setMoreInfo] = useState({
        bedroom: 0,
        bathroom: 0,
        furniture: '',
        type: '',
        typeId: '',
    });

    const handleCityChange = async (cityId: string) => {
        form.setFieldsValue({
            district: undefined,
            ward: undefined,
        });

        const city = cities.find((city) => city._id === form.getFieldValue('city'));

        setAddressName({
            city: city?.name || '',
            district: '',
            ward: '',
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

        const city = cities.find((city) => city._id === form.getFieldValue('city'));
        const district = districts.find((district) => district._id === form.getFieldValue('district'));

        setAddressName({
            city: city?.name || '',
            district: district?.name || '',
            ward: '',
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

    const handleResetArea = () => {
        form.setFieldsValue({
            city: undefined,
            district: undefined,
            ward: undefined,
        });

        setAddressName({
            city: '',
            district: '',
            ward: '',
        });
    };

    const handleChangeComplete = ([v1, v2]: number[]) => {
        setPriceRange([v1, v2]);
    };

    const handleResetPrice = () => {
        form.setFieldsValue({
            price: [0, 0],
        });

        setPriceRange([0, 0]);
    };

    const handleResetAttributes = () => {
        form.setFieldsValue({
            amenities: [],
        });

        setSelectedAttributes([]);
    };

    const handleClickReset = () => {
        form.resetFields();

        handleResetMoreInfo();
        handleResetArea();
        handleResetPrice();
        handleResetAttributes();
    };

    const handleChangeBedroom = (value: number | null) => {
        setMoreInfo((prev) => ({
            ...prev,
            bedroom: value || 0,
        }));
    };
    const handleChangeBathroom = (value: number | null) => {
        setMoreInfo((prev) => ({
            ...prev,
            bathroom: value || 0,
        }));
    };
    const handleChangeFurniture = (value: string | undefined) => {
        setMoreInfo((prev) => ({
            ...prev,
            furniture: value || '',
        }));
    };

    const handleResetMoreInfo = () => {
        form.setFieldsValue({
            bedroom: undefined,
            bathroom: undefined,
            furniture: undefined,
        });

        setMoreInfo({
            bedroom: 0,
            bathroom: 0,
            furniture: '',
            type: '',
            typeId: '',
        });
    };

    const handleChangeType = (value: string, res: any) => {
        setMoreInfo((prev) => ({
            ...prev,
            type: res.name,
            typeId: value,
        }));
    };

    const handleSearch = (values: ISearchInput) => {
        const searchParams: {
            [key: string]: any;
        } = {
            page: 1,
            pageSize: 10,
        };

        if (values.search) searchParams.q = values.search;

        const [minPrice, maxPrice] = priceRange;

        if (minPrice + maxPrice > 0) {
            searchParams.minPrice = minPrice;
            searchParams.maxPrice = maxPrice;
        }

        if (selectedAttributes.length) searchParams['amenities[]'] = selectedAttributes;

        const { bathroom, bedroom, furniture } = moreInfo;

        if (bathroom) searchParams.bathroom = bathroom;
        if (bedroom) searchParams.bedroom = bedroom;
        if (furniture) searchParams.furniture = furniture;

        const { city, district, ward } = addressName;

        if (city) searchParams.city = city;
        if (district) searchParams.district = district;
        if (ward) searchParams.ward = ward;
        if (moreInfo.type) searchParams.type = moreInfo.type;

        router.push(`${SEARCH}?${convertObjectToParams(searchParams)}`);
    };

    const handleChangePriceFrom = (value: number | null) => {
        setPriceRange([value || 0, priceRange[1]]);
        form.setFieldValue('price', [value || 0, priceRange[1]]);
    };

    const handleChangePriceTo = (value: number | null) => {
        setPriceRange([priceRange[0], value || 0]);
        form.setFieldValue('price', [priceRange[0], value || 0]);
    };

    useEffect(() => {
        const fetchCities = async () => {
            setCityLoading(true);
            try {
                const cities = await getCities();
                setCities(cities);
            } catch (error) {
            } finally {
                setCityLoading(false);
            }
        };

        fetchCities();

        const fetchAttributes = async () => {
            setLoadingAttributes(true);
            const data = await getAllAttributesCbb();
            setAttributes(data);
            setLoadingAttributes(false);
        };

        fetchAttributes();

        const fetchTypes = async () => {
            setTypeLoading(true);
            const data = await getPropertyTypes();
            setTypes(data);
            setTypeLoading(false);
        };

        fetchTypes();
    }, []);

    return (
        <div>
            <Form layout="vertical" form={form} onFinish={handleSearch}>
                <label>
                    <Flex align="center" className="border border-[#ecedf1] rounded-full overflow-hidden h-14 pl-4">
                        <Form.Item name="search" className="flex-1 !mb-0">
                            <Input
                                allowClear
                                size="large"
                                variant="borderless"
                                placeholder="Tìm kiếm nhà, tiện ích..."
                            />
                        </Form.Item>
                        <button
                            type="submit"
                            className="flex justify-center items-center gap-2 w-40 h-full text-center text-lg bg-[#1677ff] text-white"
                        >
                            <Search className="w-5 h-5" />
                            Search
                        </button>
                    </Flex>
                </label>
                <Flex className="mt-6" gap={12}>
                    <Row className="flex-1" gutter={12}>
                        <Col span={6}>
                            <FormPopover
                                className="w-full"
                                title={addressName.city ? getAddress(addressName) : 'Toàn quốc'}
                                onReset={handleResetArea}
                            >
                                <Typography.Title level={5}>Khu vực</Typography.Title>
                                <Form.Item className="!mb-2" name="city">
                                    <Select
                                        placeholder="Tỉnh, thành phố"
                                        loading={cityLoading}
                                        options={cities}
                                        {...selectProps}
                                        onChange={handleCityChange}
                                    />
                                </Form.Item>
                                <Form.Item className="!mb-2" name="district">
                                    <Select
                                        placeholder="Quận, huyện"
                                        loading={distinctLoading}
                                        options={districts}
                                        {...selectProps}
                                        onChange={handleDistrictChange}
                                    />
                                </Form.Item>
                                <Form.Item className="!mb-2" name="ward">
                                    <Select
                                        placeholder="Phường, xã"
                                        loading={wardLoading}
                                        options={wards}
                                        {...selectProps}
                                        onChange={handleWardChange}
                                    />
                                </Form.Item>
                            </FormPopover>
                        </Col>
                        <Col span={6}>
                            <FormPopover
                                className="w-full"
                                title={
                                    priceRange[0] === 0 && priceRange[1] === 0
                                        ? 'Mức giá'
                                        : `${convertCurrencyToText(priceRange[0])} - ${convertCurrencyToText(
                                              priceRange[1],
                                          )}`
                                }
                                onReset={handleResetPrice}
                            >
                                <Flex gap={2}>
                                    <Typography.Text className="flex-1">Mức giá</Typography.Text>
                                    <Typography.Text>{formatCurrency(priceRange[0])}</Typography.Text>
                                    <Typography.Text>-</Typography.Text>
                                    <Typography.Text>{formatCurrency(priceRange[1], true)}</Typography.Text>
                                </Flex>
                                <Form.Item initialValue={priceRange} className="!mb-2" name="price">
                                    <Slider
                                        value={priceRange}
                                        min={0}
                                        max={1_000_000_000}
                                        range
                                        step={1_000_000}
                                        tooltip={{
                                            formatter: (value) => formatCurrency(value as number),
                                        }}
                                        onChangeComplete={handleChangeComplete}
                                    />
                                </Form.Item>
                                <div className="!mb-2">
                                    <PriceInput
                                        value={priceRange[0]}
                                        min={0}
                                        max={priceRange[1] || 1_000_000_000}
                                        onChange={handleChangePriceFrom}
                                        placeholder="Từ"
                                    />
                                </div>
                                <div className="!mb-2">
                                    <PriceInput
                                        value={priceRange[1]}
                                        min={priceRange[0] || 0}
                                        max={1_000_000_000}
                                        onChange={handleChangePriceTo}
                                        placeholder="Đến"
                                    />
                                </div>
                            </FormPopover>
                        </Col>
                        <Col span={6}>
                            <FormPopover
                                className="w-full"
                                title={selectedAttributes.length === 0 ? 'Tiện ích' : selectedAttributes.join(', ')}
                                onReset={handleResetAttributes}
                            >
                                <Typography.Text className="flex-1">Tiện ích</Typography.Text>
                                <Form.Item className="!my-2" name="amenities">
                                    <Select
                                        loading={loadingAttributes}
                                        placeholder="Chọn tiện ích"
                                        mode="multiple"
                                        fieldNames={fieldNames}
                                        options={attributes}
                                        onChange={setSelectedAttributes}
                                    />
                                </Form.Item>
                            </FormPopover>
                        </Col>
                        <Col span={6}>
                            <FormPopover
                                className="w-full"
                                title={getTitleMoreInfo(moreInfo)}
                                onReset={handleResetMoreInfo}
                            >
                                <Typography.Text className="flex-1">Loại nhà</Typography.Text>
                                <Form.Item className="!my-2 w-full" name="type">
                                    <Select
                                        loading={typeLoading}
                                        onChange={handleChangeType}
                                        placeholder="Chọn loại nhà"
                                        options={types}
                                        fieldNames={{
                                            label: 'name',
                                            value: 'id',
                                        }}
                                    />
                                </Form.Item>
                                <Typography.Text className="flex-1">Số phòng ngủ</Typography.Text>
                                <Form.Item className="!my-2 w-full" name="bedroom">
                                    <InputNumber
                                        onChange={handleChangeBedroom}
                                        {...inputNumberProps}
                                        placeholder="Nhập số phòng ngủ"
                                    />
                                </Form.Item>
                                <Typography.Text className="flex-1">Số phòng tắm, vệ sinh</Typography.Text>
                                <Form.Item className="!my-2 w-full" name="bathroom">
                                    <InputNumber
                                        onChange={handleChangeBathroom}
                                        {...inputNumberProps}
                                        placeholder="Nhập số phòng tắm, vệ sinh"
                                    />
                                </Form.Item>
                                <Typography.Text className="flex-1">Nội thất</Typography.Text>
                                <Form.Item className="!my-2" name="furniture">
                                    <Select
                                        onChange={handleChangeFurniture}
                                        allowClear
                                        options={interiorOptions}
                                        placeholder="Chọn tình trạng nội thất"
                                    />
                                </Form.Item>
                            </FormPopover>
                        </Col>
                    </Row>
                    <button
                        type="button"
                        onClick={handleClickReset}
                        className="w-10 h-10 flex justify-center items-center border border-[#ecedf1] text-[#646d84] bg-[#ecedf1] rounded-full"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                </Flex>
            </Form>
        </div>
    );
};

export default SearchComponent;
