import Banner from '@/components/banner';
import PropertiesByLocations from '@/components/properties-by-locations/properties-by-locations';

export default async function Home() {
    return (
        <main className="p-4 md:p-6">
            <Banner />
            <PropertiesByLocations />
        </main>
    );
}
