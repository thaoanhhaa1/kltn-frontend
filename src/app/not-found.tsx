import HomeButton from '@/components/button/home-button';
import { Result } from 'antd';

export default function NotFound() {
    return (
        <div className="h-screen flex justify-center items-center">
            <Result
                status="404"
                title="404"
                subTitle="Xin lỗi, trang bạn đang tìm kiếm không tồn tại."
                extra={<HomeButton />}
            />
        </div>
    );
}
