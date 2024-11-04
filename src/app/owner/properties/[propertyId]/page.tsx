import UpdatePropertyBreadcrumb from '@/app/owner/properties/[propertyId]/update-property-breadcrumb';
import UpdatePropertyForm from '@/app/owner/properties/[propertyId]/update-property-form';
import { IAttributeCbb } from '@/interfaces/attribute';
import { IProperty } from '@/interfaces/property';
import { OWNER_PROPERTIES } from '@/path';
import { getCities, getDistricts, getWards, IAddress } from '@/services/address-service';
import { getAllAttributesCbb } from '@/services/attribute-service';
import { getPropertyById } from '@/services/property-service';
import { Button } from 'antd';
import { cookies } from 'next/headers';

const EditPropertyPage = async ({ params: { propertyId } }: { params: { propertyId: string } }) => {
    const cookiesStore = cookies();
    const accessToken = cookiesStore.get('accessToken')?.value;
    let property: IProperty | null = null;
    let cities: IAddress[] = [];
    let districts: IAddress[] = [];
    let wards: IAddress[] = [];
    let attributes: IAttributeCbb[] = [];

    try {
        [property, attributes] = await Promise.all([getPropertyById(propertyId, accessToken!), getAllAttributesCbb()]);

        if (property) {
            cities = await getCities();

            const cityId = cities.find((city) => city.name === property!.address.city)?._id || '';
            districts = await getDistricts(cityId);

            const districtId = districts.find((district) => district.name === property!.address.district)?._id || '';
            wards = await getWards(districtId);
        }
    } catch (error) {
        console.error(error);
    }

    if (!property) {
        return (
            <Button type="primary" href={OWNER_PROPERTIES}>
                Quay về trang quản lý bất động sản
            </Button>
        );
    }

    return (
        <div>
            <UpdatePropertyBreadcrumb />
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Cập nhật bất động sản
            </h2>
            <UpdatePropertyForm
                property={property}
                cities={cities}
                districts={districts}
                wards={wards}
                attributes={attributes}
            />
        </div>
    );
};

export default EditPropertyPage;
