import AddPropertyBreadcrumb from '@/app/owner/properties/add/add-property-breadcrumb';
import AddPropertyForm from '@/app/owner/properties/add/add-property-form';
import React from 'react';

const AddPropertyPage = async () => {
    return (
        <div>
            <AddPropertyBreadcrumb />
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Đăng bất động sản
            </h2>
            <AddPropertyForm />
        </div>
    );
};

export default AddPropertyPage;
