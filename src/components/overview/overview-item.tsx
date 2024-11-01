import Text from '@/components/text';
import Title from '@/components/title';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

const OverviewItem = ({ title, value, href = '' }: { title: string; value: string | number; href?: string }) => {
    const Component = href ? Link : 'div';

    return (
        <Card>
            <Component href={href} className="flex flex-col items-center gap-2 px-8 py-6">
                <Title level={1}>{value}</Title>
                <Text
                    style={{
                        color: '#1677ff',
                    }}
                >
                    {title}
                </Text>
            </Component>
        </Card>
    );
};

export default OverviewItem;
