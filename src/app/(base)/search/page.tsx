import SearchResult from '@/app/(base)/search/search-result';
import SearchComponent from '@/components/search';
import { ICountAvailableProperties } from '@/interfaces/property';
import { countAvailableProperties } from '@/services/property-service';
import { Divider } from 'antd';

const SearchPage = async () => {
    let countResult: ICountAvailableProperties = {
        data: 0,
        status: 0,
        success: false,
    };

    try {
        countResult = await countAvailableProperties();
    } catch (error) {}

    return (
        <div className="pt-12">
            <SearchComponent />
            <Divider />
            <SearchResult count={countResult.data} />
        </div>
    );
};

export default SearchPage;
