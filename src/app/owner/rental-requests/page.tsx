import RentalRequestsBreadcrumb from '@/app/owner/rental-requests/rental-requests-breadcrumb';
import RentalRequestsTable from '@/app/owner/rental-requests/rental-requests-table';

const RentalRequestPage = () => {
    return (
        <div>
            <RentalRequestsBreadcrumb />
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Yêu cầu thuê nhà
            </h2>
            <RentalRequestsTable />
        </div>
    );
};

export default RentalRequestPage;
