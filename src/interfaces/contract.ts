export interface ICreateContractRequest {
    ownerUserId: string;
    renterUserId: string;
    propertyId: string;
    startDate: string;
    endDate: string;
    contractTerms: string;
    monthlyRent: number;
    depositAmount: number;
}
