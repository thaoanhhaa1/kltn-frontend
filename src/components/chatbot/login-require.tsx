import { SIGN_IN, SIGN_UP } from '@/path';
import { Button, Flex, Typography } from 'antd';

const LoginRequire = () => {
    return (
        <Flex vertical gap={12} align="center" justify="center" flex={1}>
            <Typography.Title level={4}>Đăng nhập để chat</Typography.Title>
            <Button href={SIGN_IN} type="primary">
                Đăng nhập
            </Button>
            <Typography.Text>Chưa có tài khoản?</Typography.Text>
            <Button href={SIGN_UP} type="link">
                Đăng ký
            </Button>
        </Flex>
    );
};

export default LoginRequire;
