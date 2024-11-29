import AntButtonLink from '@/components/button/ant-button-link';
import { SIGN_IN, SIGN_UP } from '@/path';
import { Flex, Typography } from 'antd';

const LoginRequire = () => {
    return (
        <Flex vertical gap={12} align="center" justify="center" flex={1}>
            <Typography.Title level={4}>Đăng nhập để chat</Typography.Title>
            <AntButtonLink href={SIGN_IN} type="primary">
                Đăng nhập
            </AntButtonLink>
            <Typography.Text>Chưa có tài khoản?</Typography.Text>
            <AntButtonLink href={SIGN_UP} type="link">
                Đăng ký
            </AntButtonLink>
        </Flex>
    );
};

export default LoginRequire;
