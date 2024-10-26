import Paragraph from '@/components/paragraph';
import Title from '@/components/title';
import { envConfig } from '@/config/envConfig';

const Banner = () => {
    return (
        <div>
            <Title level={2}>Chào mừng bạn đến với {envConfig.NEXT_PUBLIC_WEB_NAME}!</Title>
            <Paragraph>
                {envConfig.NEXT_PUBLIC_WEB_NAME} là nơi cung cấp thông tin về các căn hộ cho thuê và nhiều hơn nữa.
            </Paragraph>
        </div>
    );
};

export default Banner;
