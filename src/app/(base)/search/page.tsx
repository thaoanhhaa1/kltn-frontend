import SearchResult from '@/app/(base)/search/search-result';
import SearchComponent from '@/components/search/search';
import { ICountAvailableProperties } from '@/interfaces/property';
import { countAvailableProperties } from '@/services/property-service';
import { Divider } from 'antd';
import { Suspense } from 'react';

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
            <Suspense>
                <SearchResult count={countResult.data} />
            </Suspense>
        </div>
    );
};

export default SearchPage;
