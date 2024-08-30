import { Flex, Skeleton } from 'antd';

const HorizontalPropertySkeleton = () => {
    return (
        <div className="rounded-md shadow-lg border-t">
            <Flex className="rounded-md overflow-hidden">
                <Skeleton.Image
                    active
                    style={{
                        flexShrink: 0,
                        width: '250px',
                        height: '100%',
                    }}
                />
                <div className="p-4 w-full">
                    <Skeleton.Input
                        active
                        block
                        style={{
                            width: '70%',
                            height: '28px',
                            marginBottom: '10px',
                        }}
                    />
                    <Skeleton.Input
                        active
                        block
                        style={{
                            height: '14px',
                            marginBottom: '8px',
                        }}
                    />
                    <Skeleton.Input
                        active
                        block
                        style={{
                            height: '14px',
                            marginBottom: '8px',
                        }}
                    />
                    <Skeleton.Input
                        active
                        block
                        style={{
                            height: '14px',
                            marginBottom: '14px',
                        }}
                    />
                    <Skeleton.Input
                        active
                        block
                        style={{
                            height: '18px',
                            width: '50%',
                        }}
                    />
                    <Flex gap={24} className="mt-5 mb-2">
                        <Skeleton.Input
                            active
                            style={{
                                height: '24px',
                                width: '24px',
                            }}
                        />
                        <Skeleton.Input
                            active
                            style={{
                                height: '24px',
                                width: '90px',
                            }}
                        />
                        <Skeleton.Input
                            active
                            style={{
                                height: '24px',
                                width: '90px',
                            }}
                        />
                    </Flex>
                    <Skeleton.Input
                        active
                        block
                        style={{
                            height: '28px',
                            width: '150px',
                            marginBottom: '10px',
                        }}
                    />
                    <Flex align="center" justify="space-between">
                        <Skeleton.Input
                            active
                            style={{
                                height: '22px',
                                width: '85px',
                            }}
                        />
                        <Skeleton.Input
                            active
                            style={{
                                width: '32px',
                                height: '32px',
                                minWidth: '32px',
                            }}
                        />
                    </Flex>
                </div>
            </Flex>
        </div>
    );
};

export default HorizontalPropertySkeleton;
