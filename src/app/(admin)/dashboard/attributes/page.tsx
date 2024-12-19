import AttributesBreadcrumb from '@/app/(admin)/dashboard/attributes/attributes-breadcrumb';
import AttributesTable from '@/app/(admin)/dashboard/attributes/attributes-table';

const AttributesPage = async () => {
    return (
        <div>
            <AttributesBreadcrumb />
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Tiện ích</h2>
            <AttributesTable />
        </div>
    );
};

export default AttributesPage;
