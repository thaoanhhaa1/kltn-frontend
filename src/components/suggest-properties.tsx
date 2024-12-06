import VerticalProperty from '@/components/property/vertical-property';
import Title from '@/components/title';
import { IProperty } from '@/interfaces/property';
import { suggest } from '@/services/property-service';
import { cookies } from 'next/headers';

const SuggestProperties = async () => {
    const cookiesStore = cookies();
    const accessToken = cookiesStore.get('accessToken')?.value;
    let properties: IProperty[] | null = null;

    if (!accessToken) return null;

    try {
        properties = await suggest(accessToken);
    } catch (error) {}

    if (!properties) return null;

    return (
        <div className="mt-8">
            <Title level={4}>Bất động sản cho bạn</Title>
            <div className="mt-2.5 swipe-container">
                {properties.map((property) => (
                    <VerticalProperty property={property} key={property.propertyId} />
                ))}
            </div>
        </div>
    );
};

export default SuggestProperties;
