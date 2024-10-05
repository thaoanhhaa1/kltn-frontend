'use client';

import TinyEditor from '@/components/tiny-editor';
import { Button, Flex, Modal, Spin } from 'antd';
import { useRef, useState } from 'react';

const ViewContractButton = ({ contractContent }: { contractContent: string }) => {
    const editorRef = useRef<any>(null);
    const [open, setOpen] = useState(false);
    const [preRender, setPreRender] = useState(true);

    const handleShow = () => setOpen(true);
    const onClose = () => setOpen(false);

    const handlePreRender = () => {
        setPreRender(false);
    };

    return (
        <>
            <Button onClick={handleShow}>Xem hợp đồng</Button>
            <Modal
                title="Hợp đồng"
                open={open}
                width="100%"
                centered
                onCancel={onClose}
                footer={null}
                style={{
                    maxWidth: '800px',
                    paddingInline: '8px',
                }}
            >
                <TinyEditor value={contractContent} onPostRender={handlePreRender} editorRef={editorRef} />
                {preRender && (
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
        </>
    );
};

export default ViewContractButton;
