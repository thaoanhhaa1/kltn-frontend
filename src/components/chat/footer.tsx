import AvatarWithName from '@/components/avatar-with-name';
import { uploadFile } from '@/lib/utils';
import { useConversationStore } from '@/stores/conversation-store';
import { useSocketStore } from '@/stores/socket-store';
import { useUserStore } from '@/stores/user-store';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Flex, Form, Image, Upload, UploadFile, UploadProps } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { RcFile } from 'antd/es/upload';
import { ImageIcon, Send } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { v4 } from 'uuid';

const Footer = () => {
    const { socket } = useSocketStore();
    const { user } = useUserStore();
    const { selectedConversation } = useConversationStore();
    const [form] = useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [, startTransition] = useTransition();
    const [imageActive, setImageActive] = useState(false);
    const [message, setMessage] = useState('');
    const [disabled, setDisabled] = useState(false);
    const receiver = selectedConversation?.participants.find((participant) => participant.userId !== user?.userId)!;

    const handleSend = (value: any) => {
        if (!socket || !selectedConversation || !user) return;

        const message = value.message;
        const medias = fileList
            .filter((file) => file.status === 'done')
            .map((file) => ({
                url: file.url,
                type: file.type,
            }));

        const createdAt = new Date();
        const chatId = `${createdAt.getTime()}-${v4()}`;

        const socketData = {
            sender: {
                userId: user?.userId,
                name: user?.name,
                avatar: user?.avatar,
            },
            receiver,
            message,
            medias,
            createdAt: createdAt.toISOString(),
            chatId,
        };

        socket.emit('receive-message', socketData);

        form.resetFields();
        setMessage('');
        setFileList([]);
    };

    const handlePreview = (file: UploadFile) => {
        if (!file.thumbUrl) return;

        setPreviewImage(file.url || file.thumbUrl);
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList((prev) => {
            return newFileList.map((file) => {
                const existingFile = prev.find((item) => item.uid === file.uid);
                if (existingFile)
                    return {
                        ...existingFile,
                        ...file,
                    };
                return file;
            });
        });
    };

    const handleBeforeUpload = async (file: RcFile) => {
        setFileList((prev) => {
            if (prev.some((item) => item.uid === file.uid))
                return prev.map((item) => (item.uid === file.uid ? { ...item, status: 'uploading' } : item));

            return [...prev, { uid: file.uid, name: file.name, status: 'uploading' }];
        });

        startTransition(async () => {
            try {
                const url = await uploadFile({
                    file,
                    folder: 'chat',
                });

                setFileList((prevList) =>
                    prevList.map((item) => (item.uid === file.uid ? { ...item, status: 'done', url } : item)),
                );
            } catch (error) {
                setFileList((prevList) =>
                    prevList.map((item) => (item.uid === file.uid ? { ...item, status: 'error' } : item)),
                );
            }
        });

        return false; // Prevent default upload behavior
    };

    const toggleImageActive = () => {
        setImageActive((prev) => !prev);
    };

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    };

    useEffect(() => {
        setDisabled((!message && fileList.length === 0) || fileList.some((item) => item.status === 'uploading'));
    }, [fileList, message]);

    return (
        <>
            {imageActive && (
                <>
                    <Upload
                        multiple
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                        beforeUpload={handleBeforeUpload}
                        maxCount={5}
                    >
                        {fileList.length >= 5 ? null : uploadButton}
                    </Upload>
                    <Divider
                        style={{
                            marginBlock: '8px',
                        }}
                    />
                </>
            )}
            <Flex
                style={{
                    padding: '8px',
                }}
                gap={8}
            >
                <AvatarWithName avatar={user?.avatar || ''} name={user?.name || ''} />
                <Form
                    form={form}
                    style={{
                        width: '100%',
                    }}
                    onFinish={handleSend}
                >
                    <Flex gap={8}>
                        <div className="flex-1">
                            <Form.Item
                                style={{
                                    margin: 0,
                                }}
                                name="message"
                            >
                                <TextArea
                                    autoSize={{
                                        minRows: 1,
                                        maxRows: 3,
                                    }}
                                    variant="borderless"
                                    placeholder="Nhập tin nhắn..."
                                    onChange={handleMessageChange}
                                />
                            </Form.Item>
                        </div>
                        <Button
                            icon={<ImageIcon className="w-5 h-5" />}
                            {...(imageActive && {
                                type: 'primary',
                                ghost: true,
                            })}
                            onClick={toggleImageActive}
                        />
                        <Button
                            icon={<Send className="w-5 h-5" />}
                            htmlType="submit"
                            type="primary"
                            disabled={disabled}
                        />
                    </Flex>
                </Form>
            </Flex>
            {previewImage && (
                <Image
                    alt="preview"
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
        </>
    );
};

const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Đăng tải</div>
    </button>
);

export default Footer;
