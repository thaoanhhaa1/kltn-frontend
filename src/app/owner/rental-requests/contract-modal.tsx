import TinyEditor from '@/components/tiny-editor';
import { IGenerateContractResponse, IRentalRequest } from '@/interfaces/rentalRequest';
import { createContract } from '@/services/contract-service';
import { generateContract, ownerUpdateRentalRequestStatus } from '@/services/rental-request-service';
import { Flex, Modal, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

const ContractModal = ({
    rentalRequest,
    open,
    onClose,
    fetchRentalRequests,
}: {
    rentalRequest?: IRentalRequest;
    open: boolean;
    onClose: () => void;
    fetchRentalRequests: () => Promise<void>;
}) => {
    const editorRef = useRef<any>(null);
    const [preRender, setPreRender] = useState(true);
    const [loading, setLoading] = useState(false);
    const [contract, setContract] = useState<IGenerateContractResponse | undefined>();
    const [createLoading, setCreateLoading] = useState(false);

    const handleOk = async () => {
        if (!contract) return;
        setCreateLoading(true);

        try {
            const content = editorRef.current.getContent();

            await Promise.all([
                ownerUpdateRentalRequestStatus({
                    requestId: rentalRequest?.requestId!,
                    status: 'APPROVED',
                }),
                createContract({
                    ...contract,
                    contractTerms: content,
                    ownerId: contract.ownerId,
                    renterId: contract.renterId,
                }),
            ]);

            toast.success('Tạo hợp đồng thành công');
            await fetchRentalRequests();
            onClose();
        } catch (error) {
            console.log(error);
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Có lỗi xảy ra');
            }
        } finally {
            setCreateLoading(false);
        }
    };

    const handlePreRender = () => {
        setPreRender(false);
    };

    useEffect(() => {
        const fetch = async () => {
            try {
                const contract = await generateContract({
                    propertyId: rentalRequest?.property.propertyId!,
                    renterId: rentalRequest?.renterId!,
                    requestId: rentalRequest?.requestId!,
                });

                setContract(contract);
            } catch (error) {
                console.log(error);
                if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    toast.error('Có lỗi xảy ra');
                }
            } finally {
                setLoading(false);
            }
        };

        rentalRequest && fetch();
    }, [rentalRequest, rentalRequest?.property.propertyId, rentalRequest?.renterId, rentalRequest?.requestId]);

    return (
        <Modal
            title="Tạo hợp đồng"
            open={open}
            okText="Tạo hợp đồng"
            confirmLoading={createLoading}
            cancelText="Huỷ"
            width="100%"
            centered
            onOk={handleOk}
            onCancel={onClose}
            style={{
                maxWidth: '800px',
                paddingInline: '8px',
            }}
            okButtonProps={{
                disabled: !contract,
            }}
        >
            <TinyEditor value={contract?.contractContent} onPostRender={handlePreRender} editorRef={editorRef} />
            {(preRender || loading) && (
                <Flex
                    justify="center"
                    align="center"
                    style={{
                        height: '80vh',
                    }}
                >
                    <Spin size="large" />
                </Flex>
            )}
        </Modal>
    );
};

export default ContractModal;
