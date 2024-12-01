import Header from '@/app/(base)/rental-requests/header';
import RentalRequests from '@/app/(base)/rental-requests/rental-requests';

const RentalRequestPage = async () => {
    return (
        <div className="mt-5 pb-5">
            <Header />
            <RentalRequests />
        </div>
    );
};

export default RentalRequestPage;
