import AntButtonLink from '@/components/button/ant-button-link';
import { HOME } from '@/path';
import { Result } from 'antd';

const Forbidden = () => {
    return (
        <Result
            status="403"
            title="403"
            subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
            extra={
                <AntButtonLink type="primary" href={HOME}>
                    Quay về trang chủ
                </AntButtonLink>
            }
        />
    );
};

export default Forbidden;
