import SearchSuggestItem from '@/components/search/search-suggest-item';
import { Card } from '@/components/ui/card';
import { SuggestSearch } from '@/interfaces/property';
import { Flex, Spin } from 'antd';

const SearchSuggest = ({ loading, data }: { loading: boolean; data: Array<SuggestSearch> }) => {
    return (
        <Card className="absolute left-0 right-0 top-full py-4 z-50 rounded-[28px]">
            {loading && (
                <Flex justify="center">
                    <Spin />
                </Flex>
            )}
            {loading || (
                <Flex vertical gap={12}>
                    {data.map((item) => (
                        <SearchSuggestItem key={item.slug} data={item} />
                    ))}
                </Flex>
            )}
        </Card>
    );
};

export default SearchSuggest;
