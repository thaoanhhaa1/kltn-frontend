'use client';

import { AddPropertyDictionary } from '@/app/[lang]/dictionaries';
import { InboxOutlined } from '@ant-design/icons';
import { Form, UploadProps } from 'antd';
import Dragger from 'antd/es/upload/Dragger';

const ImagesForm = ({ addPropertyDict }: { addPropertyDict: AddPropertyDictionary }) => {
    const props: UploadProps = {
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
                        message: addPropertyDict['upload-requires'],
                    },
                ]}
            >
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">{addPropertyDict['upload-title']}</p>
                    <p className="ant-upload-hint">{addPropertyDict['upload-subtitle']}</p>
                </Dragger>
            </Form.Item>
        </div>
    );
};

export default ImagesForm;
