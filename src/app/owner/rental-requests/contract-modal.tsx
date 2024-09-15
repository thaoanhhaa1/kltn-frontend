import { envConfig } from '@/config/envConfig';
import { IGenerateContractResponse, IRentalRequest } from '@/interfaces/rentalRequest';
import { generateContract } from '@/services/rental-request-service';
import { Editor } from '@tinymce/tinymce-react';
import { Flex, Modal, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';

const ContractModal = ({
    rentalRequest,
    open,
    onClose,
}: {
    rentalRequest?: IRentalRequest;
    open: boolean;
    onClose: () => void;
}) => {
    const editorRef = useRef<any>(null);
    const [preRender, setPreRender] = useState(true);
    const [loading, setLoading] = useState(false);
    const [contract, setContract] = useState<IGenerateContractResponse | undefined>();

    const handleOk = () => {};

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
            cancelText="Huỷ"
            width="100%"
            centered
            onOk={handleOk}
            onCancel={onClose}
            style={{
                maxWidth: '800px',
                paddingInline: '8px',
            }}
        >
            <Editor
                value={contract?.contractContent}
                onPostRender={handlePreRender}
                apiKey={envConfig.NEXT_PUBLIC_TINY_MCE_API_KEY}
                onInit={(_evt, editor) => (editorRef.current = editor)}
                init={{
                    editable_root: false,
                    resize: false,
                    height: '80vh',
                    menubar: false,
                    plugins: [
                        'advlist',
                        'autolink',
                        'lists',
                        'link',
                        'image',
                        'charmap',
                        'preview',
                        'anchor',
                        'searchreplace',
                        'visualblocks',
                        'code',
                        'fullscreen',
                        'insertdatetime',
                        'media',
                        'table',
                        'code',
                        'help',
                        'wordcount',
                    ],
                    toolbar:
                        'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                }}
            />
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
