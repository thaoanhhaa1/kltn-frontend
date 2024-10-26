import FavoriteList from '@/app/(base)/favorite/favorite-list';
import Title from '@/components/title';
import { Flex } from 'antd';

const FavoritePage = () => {
    return (
        <Flex align="center" className="my-5" vertical gap={24}>
            <Title level={3}>Yêu thích</Title>
            <FavoriteList />
        </Flex>
    );
};

export default FavoritePage;
