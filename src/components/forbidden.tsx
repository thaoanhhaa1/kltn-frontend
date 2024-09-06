import { HOME } from '@/path';
import { Button, Result } from 'antd';

const Forbidden = () => {
    return (
        <Result
            status="403"
            title="403"
            subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
            extra={
                <Button type="primary" href={HOME}>
                    Quay về trang chủ
                </Button>
            }
        />
    );
};

export default Forbidden;
