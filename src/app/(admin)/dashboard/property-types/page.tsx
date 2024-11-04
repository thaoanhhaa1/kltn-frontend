import PropertyTypesTable from '@/app/(admin)/dashboard/property-types/property-types-table';
import PropertyTypesBreadcrumb from '@/app/(admin)/dashboard/property-types/propertype-types-breadcrumb';
import Forbidden from '@/components/forbidden';
import { IPropertyTypeDetail } from '@/interfaces/property-type';
import { getPropertyTypesByAdmin } from '@/services/property-type';
import { cookies } from 'next/headers';

const PropertyTypesPage = async () => {
    const cookiesStore = cookies();
    const accessToken = cookiesStore.get('accessToken')?.value;
    let types: IPropertyTypeDetail[] = [];

    try {
        types = await getPropertyTypesByAdmin(accessToken!);
    } catch (error) {
        console.log(error);

        return <Forbidden />;
    }

    return (
        <div>
            <PropertyTypesBreadcrumb />
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Loại bất động sản
            </h2>
            <PropertyTypesTable types={types} />
        </div>
    );
};

export default PropertyTypesPage;
