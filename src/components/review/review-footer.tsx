'use client';

import AvatarWithName from '@/components/avatar-with-name';
import { IReplyReview } from '@/interfaces/review';
import { createReview, updateReview } from '@/services/review-service';
import { useUserStore } from '@/stores/user-store';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Flex, Form, Image, Rate, Upload, UploadFile } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { ImageIcon, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'react-toastify';

const ReviewFooter = ({
    review,
    ownerId,
    reviewId,
    isFirst,
    contractId,
    propertyId,
    setIsEdit,
}: {
    review?: IReplyReview;
    isFirst?: boolean;
    reviewId?: string;
    ownerId: string;
    propertyId: string;
    contractId: string;
    setIsEdit?: Dispatch<SetStateAction<boolean>>;
}) => {
    const { user } = useUserStore();
    const [form] = useForm();
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [imageActive, setImageActive] = useState(Boolean(review?.medias.length));
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const isOwner = user?.userId === ownerId;
    const isEdit = Boolean(review);

    const handleSend = async (value: any) => {
        setLoading(true);
        const fileList: UploadFile<any>[] = value.medias?.fileList || [];

        const formData = new FormData();
        fileList.forEach(
            (file) => file.originFileObj && formData.append(isEdit ? 'new-medias' : 'medias', file.originFileObj),
        );
        formData.append('content', value.message);
        formData.append('rating', String((value.rating || 5) * 2));
        formData.append('propertyId', propertyId);
        formData.append('contractId', contractId);
        if (isEdit) {
            fileList.forEach(
                (file) =>
                    !file.originFileObj && file.status === 'done' && formData.append('medias', file.url as string),
            );
            if (reviewId !== review?.id) formData.append('replyId', review?.id || '');
        }

        try {
            await (reviewId ? updateReview(reviewId, formData) : createReview(formData));

            form.resetFields();
            router.refresh();
            setIsEdit?.(false);
        } catch (error: any) {
            toast.error(error.message || 'Đã có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = (file: UploadFile) => {
        if (!file.thumbUrl) return;

        setPreviewImage(file.url || file.thumbUrl);
        setPreviewOpen(true);
    };

    const toggleImageActive = () => {
        setImageActive((prev) => !prev);
    };

    if (!user) return null;
    if (isOwner && isFirst) return null;

    return (
        <>
            {Boolean(review) || (
                <Divider
                    style={{
                        marginBlock: '8px',
                    }}
                />
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
                    {isFirst && (
                        <Form.Item
                            name="rating"
                            initialValue={(review?.rating && review.rating / 2) || 5}
                            style={{
                                marginBottom: 0,
                            }}
                        >
                            <Rate
                                style={{
                                    paddingInline: '11px',
                                }}
                                allowHalf
                            />
                        </Form.Item>
                    )}
                    <Flex gap={8}>
                        <div className="flex-1">
                            <Form.Item
                                style={{
                                    margin: 0,
                                }}
                                name="message"
                                initialValue={review?.content}
                            >
                                <TextArea
                                    autoSize={{
                                        minRows: 1,
                                        maxRows: 3,
                                    }}
                                    variant="borderless"
                                    placeholder="Nhập đánh giá..."
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
                            loading={loading}
                            icon={<Send className="w-5 h-5" />}
                            htmlType="submit"
                            type="primary"
                        />
                    </Flex>
                    {imageActive && (
                        <div className="px-[11px]">
                            <Form.Item
                                name="medias"
                                style={{
                                    marginBottom: 0,
                                }}
                            >
                                <Upload
                                    defaultFileList={
                                        review?.medias.map(
                                            (media) =>
                                                ({
                                                    uid: media,
                                                    status: 'done',
                                                    url: media,
                                                } as UploadFile),
                                        ) || []
                                    }
                                    multiple
                                    listType="picture-card"
                                    onPreview={handlePreview}
                                    maxCount={5}
                                    accept="image/*,video/*"
                                >
                                    {form.getFieldValue('medias')?.length >= 5 ? null : uploadButton}
                                </Upload>
                            </Form.Item>
                        </div>
                    )}
                    {setIsEdit && (
                        <Button type="link" onClick={() => setIsEdit?.(false)}>
                            Hủy
                        </Button>
                    )}
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

export default ReviewFooter;
