import PropertyTypesTable from '@/app/(admin)/dashboard/property-types/property-types-table';
import PropertyTypesBreadcrumb from '@/app/(admin)/dashboard/property-types/propertype-types-breadcrumb';

const PropertyTypesPage = async () => {
    return (
        <div>
            <PropertyTypesBreadcrumb />
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Loại bất động sản
            </h2>
            <PropertyTypesTable />
        </div>
    );
};

export default PropertyTypesPage;
