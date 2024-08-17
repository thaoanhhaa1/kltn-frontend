import PropertiesBreadcrumb from '@/app/[lang]/(admin)/dashboard/properties/properties-breadcrumb';
import { getDictionary } from '@/app/[lang]/dictionaries';
import PropertiesTable from './properties-table';

const PropertiesPage = async ({
    params: { lang },
}: {
    params: {
        lang: string;
    };
}) => {
    const dict = await getDictionary(lang);
    const propertiesDashboardDict = dict['property-dashboard'];
    const sidebarDict = dict['sidebar'];

    return (
        <div>
            <PropertiesBreadcrumb sidebarDict={sidebarDict} />
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                {sidebarDict.properties}
            </h2>
            <PropertiesTable propertiesDashboardDict={propertiesDashboardDict} />
        </div>
    );
};

export default PropertiesPage;
