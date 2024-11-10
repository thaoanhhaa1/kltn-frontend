import ReportsBreadcrumb from '@/app/(admin)/dashboard/reports/reports-breadcrumb';
import ReportsTable from '@/app/(admin)/dashboard/reports/reports-table';

const ReportPage = async () => {
    return (
        <div>
            <ReportsBreadcrumb />
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Quản lý báo cáo
            </h2>
            <ReportsTable />
        </div>
    );
};

export default ReportPage;
