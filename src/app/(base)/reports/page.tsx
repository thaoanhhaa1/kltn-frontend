import ReportsTable from '@/app/(base)/reports/reports-table';
import Title from '@/components/title';

const ReportPage = async () => {
    return (
        <div className="mt-5">
            <Title
                style={{
                    textAlign: 'center',
                    marginBottom: '12px',
                }}
                level={3}
            >
                Báo cáo của tôi
            </Title>
            <ReportsTable />
        </div>
    );
};

export default ReportPage;
