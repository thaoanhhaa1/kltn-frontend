import { getDictionary } from '@/app/[lang]/dictionaries';
import AddPropertyBreadcrumb from '@/app/[lang]/owner/properties/add/add-property-breadcrumb';
import AddPropertyForm from '@/app/[lang]/owner/properties/add/add-property-form';
import React from 'react';

const AddPropertyPage = async ({
    params: { lang },
}: {
    params: {
        lang: string;
    };
}) => {
    const dict = await getDictionary(lang);
    const sidebarDict = dict['owner-sidebar'];
    const addPropertyDict = dict['add-property'];

    return (
        <div>
            <AddPropertyBreadcrumb sidebarDict={sidebarDict} />
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                {sidebarDict.post}
            </h2>
            <AddPropertyForm lang={lang} addPropertyDict={addPropertyDict} />
        </div>
    );
};

export default AddPropertyPage;
