import { ICreateContractRequest } from '@/interfaces/contract';
import http from '@/lib/http';

export const createContract = ({
    contractTerms,
    depositAmount,
    endDate,
    monthlyRent,
    ownerUserId,
    propertyId,
    renterUserId,
    startDate,
}: ICreateContractRequest) => {
    return http.post('/contract-service/contracts', {
        owner_user_id: ownerUserId,
        renter_user_id: renterUserId,
        property_id: propertyId,
        start_date: startDate,
        end_date: endDate,
        contract_terms: contractTerms,
        monthly_rent: monthlyRent,
        deposit_amount: depositAmount,
    });
};
