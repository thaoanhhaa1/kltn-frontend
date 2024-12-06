import Banner from '@/components/banner';
import PropertiesByLocations from '@/components/properties-by-locations/properties-by-locations';
import HorizontalProperty from '@/components/property/horizontal-property';
import SearchComponent from '@/components/search/search';
import SuggestProperties from '@/components/suggest-properties';
import Title from '@/components/title';
import { initDataTable } from '@/constants/init-data';
import { IProperty } from '@/interfaces/property';
import { ITable } from '@/interfaces/table';
import { searchProperties } from '@/services/property-service';

export default async function Home() {
    let properties: ITable<IProperty> = initDataTable;

    try {
        properties = await searchProperties('sort=newest');
    } catch (error) {}

    return (
        <main className="p-4 md:p-6">
            <Banner />
            <SearchComponent />
            <SuggestProperties />
            <PropertiesByLocations />
            <Title level={4}>Bất động sản mới</Title>
            <div className={'gap-6 grid grid-cols-1 mt-2.5'}>
                {properties.data.map((property) => (
                    <HorizontalProperty property={property} key={property.propertyId} />
                ))}
            </div>
        </main>
    );
}
