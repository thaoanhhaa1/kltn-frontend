import { Form } from 'antd';
import TextArea from 'antd/es/input/TextArea';

const ArticleInfoForm = () => {
    return (
        <div>
            <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
                <TextArea
                    autoSize={{
                        maxRows: 3,
                        minRows: 3,
                    }}
                    placeholder="Nhập tiêu đề"
                />
            </Form.Item>
            <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
                <TextArea
                    autoSize={{
                        maxRows: 5,
                        minRows: 5,
                    }}
                    placeholder="Nhập mô tả"
                />
            </Form.Item>
        </div>
    );
};

export default ArticleInfoForm;
