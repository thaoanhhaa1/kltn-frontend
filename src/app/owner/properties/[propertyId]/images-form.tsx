'use client';

import { InboxOutlined } from '@ant-design/icons';
import { Form, UploadFile, UploadProps } from 'antd';
import Dragger from 'antd/es/upload/Dragger';

const ImagesForm = ({ images }: { images: Array<string> }) => {
    const props: UploadProps = {
        defaultFileList:
            images.map(
                (media) =>
                    ({
                        uid: media,
                        status: 'done',
                        url: media,
                    } as UploadFile),
            ) || [],
        name: 'images',
        multiple: true,
        accept: 'image/*',
        listType: 'picture-card',
        showUploadList: {
            showPreviewIcon: false,
        },
        iconRender: () => null,
        onChange: (info) => {
            console.log(info);
        },
    };

    return (
        <div>
            <Form.Item
                name="images"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng tải lên ít nhất một hình ảnh hoặc video',
                    },
                ]}
            >
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
                    <p className="ant-upload-hint">
                        Hỗ trợ tải lên một lần hoặc hàng loạt. Nghiêm cấm tải lên dữ liệu công ty hoặc các tệp bị cấm
                        khác.
                    </p>
                </Dragger>
            </Form.Item>
        </div>
    );
};

export default ImagesForm;
