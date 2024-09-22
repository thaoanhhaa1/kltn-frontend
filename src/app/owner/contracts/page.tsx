import ContractsBreadcrumb from '@/app/owner/contracts/contracts-breadcrumb';
import ContractsTable from '@/app/owner/contracts/contracts-table';
import { Suspense } from 'react';

const ContractsPage = () => {
    return (
        <div>
            <ContractsBreadcrumb />
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Quản lý hợp đồng
            </h2>
            <Suspense>
                <ContractsTable />
            </Suspense>
        </div>
    );
};

export default ContractsPage;
