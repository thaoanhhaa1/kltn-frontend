import AttributesBreadcrumb from '@/app/(admin)/dashboard/attributes/attributes-breadcrumb';
import AttributesTable from '@/app/(admin)/dashboard/attributes/attributes-table';
import Forbidden from '@/components/forbidden';
import { IAttribute } from '@/interfaces/attribute';
import { getAllAttributes } from '@/services/attribute-service';
import { cookies } from 'next/headers';

const AttributesPage = async () => {
    const cookiesStore = cookies();
    const accessToken = cookiesStore.get('accessToken')?.value;
    let attributes: IAttribute[] = [];

    try {
        attributes = await getAllAttributes(accessToken!);
    } catch (error) {
        console.log(error);

        return <Forbidden />;
    }

    return (
        <div>
            <AttributesBreadcrumb />
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Tiện ích</h2>
            <AttributesTable attributes={attributes} />
        </div>
    );
};

export default AttributesPage;
