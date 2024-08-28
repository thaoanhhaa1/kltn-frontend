import PropertiesBreadcrumb from '@/app/owner/properties/properties-breadcrumb';
import PropertiesTable from '@/app/owner/properties/properties-table';

const PropertiesPage = async () => {
    return (
        <div>
            <PropertiesBreadcrumb />
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Bất động sản</h2>
            <PropertiesTable />
        </div>
    );
};

export default PropertiesPage;
