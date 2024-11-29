import { Button, Flex, Typography } from 'antd';

const ErrorComponent = ({ error, reset }: { error: Error; reset: () => void }) => {
    return (
        <Flex vertical justify="space-between" align="center" gap={8}>
            <Typography.Text type="danger">{error.message}</Typography.Text>
            <Button onClick={reset}>Thử lại</Button>
        </Flex>
    );
};

export default ErrorComponent;
