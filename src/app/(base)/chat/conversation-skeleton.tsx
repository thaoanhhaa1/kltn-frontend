import { cn } from '@/lib/utils';
import { Flex, Skeleton } from 'antd';

const ConversationSkeleton = () => {
    return (
        <div className={cn('p-2 rounded')}>
            <Flex align="center" gap={12}>
                <Skeleton.Avatar active size={40} />
                <Flex flex={1} align="center" gap={8}>
                    <div className="flex-1">
                        <Skeleton.Input
                            active
                            block
                            style={{
                                height: '16px',
                                marginBlock: '4px',
                            }}
                        />
                        <Skeleton.Input
                            active
                            block
                            style={{
                                height: '14px',
                                marginBlock: '4px',
                            }}
                        />
                    </div>
                </Flex>
            </Flex>
        </div>
    );
};

export default ConversationSkeleton;
