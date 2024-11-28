'use client';

import PriceInput from '@/components/input/price-input';
import TinyEditor from '@/components/tiny-editor';
import { datePickerProps, inputNumberProps } from '@/constants/init-props';
import useSignMessageCustom from '@/hooks/useSignMessageCustom';
import { ICreateContractRequest, IGenerateContractRes } from '@/interfaces/contract';
import { IProperty } from '@/interfaces/property';
import { IUser } from '@/interfaces/user';
import { getOwnerCreateContractMessage } from '@/lib/utils';
import { createContract, generateContractService } from '@/services/contract-service';
import { getAllPropertiesCbbForOwner } from '@/services/property-service';
import { getAllRentersCbb } from '@/services/user-service';
import { useUserStore } from '@/stores/user-store';
import { Button, Col, DatePicker, Flex, Form, InputNumber, Modal, Row, Select, Spin, StepProps, Steps } from 'antd';
import { useForm } from 'antd/es/form/Form';
import dayjs, { Dayjs } from 'dayjs';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

interface IRentalRequest {
    rentalStartDate: Dayjs;
    rentalEndDate: Dayjs;
    rentalPrice: number;
    rentalDeposit: number;
    renterId: string;
    propertyId: string;
}

const initSteps: Array<StepProps> = [
    {
        title: 'Thông tin hợp đồng',
        status: 'process',
    },
    {
        title: 'Chi tiết hợp đồng',
        status: 'process',
    },
];

const modalStyle = {
    maxWidth: '800px',
    paddingInline: '8px',
};

const AddContractModal = ({
    open,
    refresh,
    setOpen,
}: {
    open: boolean;
    refresh: () => void;
    setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
    const { user } = useUserStore();
    const [form] = useForm<IRentalRequest>();
    const [fromDate, setFromDate] = useState<Dayjs>();
    const [months, setMonths] = useState<number | null>(null);
    const [property, setProperty] = useState<IProperty>();
    const [renters, setRenters] = useState<IUser[]>([]);
    const [renterLoading, setRenterLoading] = useState(false);
    const [properties, setProperties] = useState<IProperty[]>([]);
    const [propertyLoading, setPropertyLoading] = useState(false);
    const [steps, setSteps] = useState<Array<StepProps>>(initSteps);
    const [step, setStep] = useState(0);
    const [generateLoading, setGenerateLoading] = useState(false);
    const [generateContract, setGenerateContract] = useState<IGenerateContractRes | null>(null);
    const editorRef = useRef<any>(null);
    const [preRender, setPreRender] = useState(true);
    const [createLoading, setCreateLoading] = useState(false);
    const { handleSign } = useSignMessageCustom();

    const handleChangeFromDate = (date: Dayjs) => {
        setFromDate(date);

        if (months && date) {
            form.setFieldValue('rentalEndDate', date.add(months, 'month'));
        }
    };

    const handleCancel = () => {
        setOpen(false);

        form.resetFields();
        setFromDate(undefined);
        setMonths(null);
        setProperty(undefined);
        setStep(0);
        setGenerateContract(null);
        setPreRender(true);
        setSteps(initSteps);
    };

    const handleChangeMonths = (value: number | null) => {
        setMonths(value);

        if (fromDate && value) {
            form.setFieldValue('rentalEndDate', fromDate.add(value, 'month'));
        }
    };

    const validateOneStep = async () => {
        try {
            await form.validateFields();

            return true;
        } catch (error) {
            console.log('🚀 ~ validateOneStep ~ error:', error);
            return false;
        }
    };

    const handleNext = async () => {
        setCreateLoading(false);
        setGenerateLoading(true);
        setSteps([
            {
                title: 'Thông tin hợp đồng',
                status: 'wait',
            },
            {
                title: 'Chi tiết hợp đồng',
                status: 'process',
            },
        ]);

        try {
            const validate = await validateOneStep();
            console.log('🚀 ~ handleNext ~ validate:', validate);

            if (!validate) return setGenerateLoading(false);

            const values = form.getFieldsValue();

            const res = await generateContractService({
                ...values,
                rentalStartDate: values.rentalStartDate.format('YYYY-MM-DD'),
                rentalEndDate: values.rentalEndDate.format('YYYY-MM-DD'),
            });

            setGenerateContract(res);
            setSteps([
                {
                    title: 'Thông tin hợp đồng',
                    status: 'finish',
                },
                {
                    title: 'Chi tiết hợp đồng',
                    status: 'process',
                },
            ]);
            setStep(step + 1);
        } catch (error) {
            toast.error((error as Error).message || 'Có lỗi xảy ra');
            setSteps([
                {
                    title: 'Thông tin hợp đồng',
                    status: 'error',
                },
                {
                    title: 'Chi tiết hợp đồng',
                    status: 'process',
                },
            ]);
        } finally {
            setGenerateLoading(false);
        }
    };

    const handlePrev = () => {
        setCreateLoading(false);
        setStep(step - 1);
        setPreRender(true);
        setSteps([
            {
                title: 'Thông tin hợp đồng',
                status: 'process',
            },
            {
                title: 'Chi tiết hợp đồng',
                status: 'process',
            },
        ]);
    };

    const handleCreateContract = async () => {
        setCreateLoading(true);
        setSteps([
            {
                title: 'Thông tin hợp đồng',
                status: 'finish',
            },
            {
                title: 'Chi tiết hợp đồng',
                status: 'wait',
            },
        ]);

        try {
            const data: ICreateContractRequest = {
                contractTerms: generateContract?.contractContent!,
                depositAmount: form.getFieldValue('rentalDeposit'),
                endDate: form.getFieldValue('rentalEndDate').format('YYYY-MM-DD'),
                monthlyRent: form.getFieldValue('rentalPrice'),
                ownerId: user!.userId,
                propertyId: form.getFieldValue('propertyId'),
                renterId: form.getFieldValue('renterId'),
                startDate: form.getFieldValue('rentalStartDate').format('YYYY-MM-DD'),
                signature: '',
            };

            const message = getOwnerCreateContractMessage(data);

            const signature = await handleSign({
                message,
            });

            await createContract({
                ...data,
                signature,
            });

            toast.success('Tạo hợp đồng thành công');

            setSteps([
                {
                    title: 'Thông tin hợp đồng',
                    status: 'finish',
                },
                {
                    title: 'Chi tiết hợp đồng',
                    status: 'finish',
                },
            ]);
            handleCancel();
            setCreateLoading(false);
            refresh();
        } catch (error) {
            setCreateLoading(false);
            toast.error((error as Error).message || 'Có lỗi xảy ra');
            setSteps([
                {
                    title: 'Thông tin hợp đồng',
                    status: 'finish',
                },
                {
                    title: 'Chi tiết hợp đồng',
                    status: 'error',
                },
            ]);
        }
    };

    const handleChangeProperty = (_propertyId: string, property: IProperty | IProperty[]) => {
        const p = property as IProperty;

        setProperty(property as IProperty);

        form.setFieldsValue({
            rentalDeposit: p.deposit,
            rentalPrice: p.price,
        });
    };

    const handleEditorChange = (value: string) => {
        if (generateContract) {
            setGenerateContract({
                ...generateContract,
                contractContent: value,
            });
        }
    };

    const handlePreRender = () => {
        setPreRender(false);
    };

    useEffect(() => {
        const fetchRenters = async () => {
            try {
                setRenterLoading(true);

                const renters = await getAllRentersCbb();

                setRenters(renters);
            } catch (error) {
            } finally {
                setRenterLoading(false);
            }
        };

        const fetchProperties = async () => {
            try {
                setPropertyLoading(true);

                const properties = await getAllPropertiesCbbForOwner();

                setProperties(properties);
            } catch (error) {
            } finally {
                setPropertyLoading(false);
            }
        };

        fetchRenters();
        fetchProperties();
    }, []);

    return (
        <Modal
            title="Tạo hợp đồng"
            open={open}
            style={modalStyle}
            className="!w-full"
            centered
            onCancel={handleCancel}
            footer={
                <Flex justify="end" gap={8}>
                    <Button onClick={handleCancel}>Huỷ</Button>
                    {step === 0 && (
                        <Button type="primary" loading={generateLoading} onClick={handleNext}>
                            Tiếp theo
                        </Button>
                    )}
                    {step === 1 && (
                        <Button color="default" variant="outlined" onClick={handlePrev}>
                            Quay lại
                        </Button>
                    )}
                    {step === 1 && (
                        <Button type="primary" loading={createLoading} onClick={handleCreateContract}>
                            Tạo hợp đồng
                        </Button>
                    )}
                </Flex>
            }
        >
            <Flex
                justify="center"
                style={{
                    marginBottom: '12px',
                }}
            >
                <Steps current={step} items={steps} />
            </Flex>
            {step === 0 && (
                <Form layout="vertical" form={form}>
                    <Row gutter={8}>
                        <Col span={12}>
                            <Form.Item
                                label="Người thuê"
                                name="renterId"
                                rules={[{ required: true, message: 'Chọn người thuê' }]}
                            >
                                <Select
                                    loading={renterLoading}
                                    placeholder="Chọn người thuê"
                                    options={renters}
                                    fieldNames={{
                                        label: 'name',
                                        value: 'userId',
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Bất động sản"
                                name="propertyId"
                                rules={[{ required: true, message: 'Chọn bất động sản' }]}
                            >
                                <Select
                                    loading={propertyLoading}
                                    placeholder="Chọn bất động sản"
                                    options={properties}
                                    fieldNames={{
                                        label: 'title',
                                        value: 'propertyId',
                                    }}
                                    onChange={handleChangeProperty}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Ngày bắt đầu"
                                name="rentalStartDate"
                                rules={[{ required: true, message: 'Chọn ngày bắt đầu' }]}
                            >
                                <DatePicker
                                    {...datePickerProps}
                                    placeholder="Ngày bắt đầu"
                                    // minDate={dayjs().add(1, 'day')} // FIXME: Uncomment this line
                                    minDate={dayjs()} // FIXME: Remove this line
                                    onChange={handleChangeFromDate}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                label="Số tháng"
                                name="months"
                                rules={[{ required: true, message: 'Nhập số tháng thuê' }]}
                            >
                                <InputNumber
                                    addonAfter="tháng"
                                    {...inputNumberProps}
                                    min={property?.minDuration || 1}
                                    max={12}
                                    placeholder="Số tháng"
                                    onChange={handleChangeMonths}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item label="Ngày kết thúc" name="rentalEndDate">
                                <DatePicker {...datePickerProps} disabled={true} placeholder="Ngày kết thúc" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Tiền thuê"
                                name="rentalPrice"
                                rules={[{ required: true, message: 'Nhập số tiền thuê' }]}
                            >
                                <PriceInput placeholder="Nhập tiền thuê" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Tiền cọc"
                                name="rentalDeposit"
                                rules={[{ required: true, message: 'Nhập số tiền cọc' }]}
                            >
                                <PriceInput placeholder="Nhập tiền cọc" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            )}
            {step === 1 && (
                <>
                    <TinyEditor
                        onPostRender={handlePreRender}
                        init={{
                            height: '65vh',
                        }}
                        editableRoot
                        editorRef={editorRef}
                        value={generateContract?.contractContent}
                        onEditorChange={handleEditorChange}
                    />
                    {preRender && (
                        <Flex
                            justify="center"
                            align="center"
                            style={{
                                height: '65vh',
                            }}
                        >
                            <Spin size="large" />
                        </Flex>
                    )}
                </>
            )}
        </Modal>
    );
};

export default AddContractModal;
