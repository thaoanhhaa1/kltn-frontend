import { AddPropertyDictionary } from '@/app/[lang]/dictionaries';
import { Form } from 'antd';
import TextArea from 'antd/es/input/TextArea';

const ArticleInfoForm = ({ addPropertyDict }: { addPropertyDict: AddPropertyDictionary }) => {
    return (
        <div>
            <Form.Item
                label={addPropertyDict.title}
                name="title"
                rules={[{ required: true, message: addPropertyDict['title-required'] }]}
            >
                <TextArea
                    autoSize={{
                        maxRows: 3,
                        minRows: 3,
                    }}
                    placeholder={addPropertyDict['title-placeholder']}
                />
            </Form.Item>
            <Form.Item
                label={addPropertyDict.description}
                name="description"
                rules={[{ required: true, message: addPropertyDict['description-required'] }]}
            >
                <TextArea
                    autoSize={{
                        maxRows: 5,
                        minRows: 5,
                    }}
                    placeholder={addPropertyDict['description-placeholder']}
                />
            </Form.Item>
        </div>
    );
};

export default ArticleInfoForm;
