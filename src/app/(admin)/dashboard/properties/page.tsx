import PropertiesBreadcrumb from '@/app/(admin)/dashboard/properties/properties-breadcrumb';
import { Suspense } from 'react';
import PropertiesTable from './properties-table';

const PropertiesPage = () => {
    return (
        <div>
            <PropertiesBreadcrumb />
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Bất động sản</h2>
            <Suspense>
                <PropertiesTable />
            </Suspense>
        </div>
    );
};

export default PropertiesPage;
