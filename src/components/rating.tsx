import Text from '@/components/text';
import { Flex, Rate } from 'antd';

const Rating = ({ rating }: { rating: number }) => {
    return (
        <Flex
            gap={6}
            align="center"
            style={{
                width: 'fit-content',
            }}
            className="border border-[#fadb14] bg-[#fadb14] bg-opacity-5 px-2 py-1 rounded"
        >
            <Rate disabled count={1} value={1} />
            <Text>{rating.toFixed(2)}</Text>
        </Flex>
    );
};

export default Rating;
