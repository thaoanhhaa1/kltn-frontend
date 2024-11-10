import { PlusOutlined } from '@ant-design/icons';

const UploadButton = () => {
    return (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Đăng tải</div>
        </button>
    );
};

export default UploadButton;
