import IncomeExpenditure from '@/app/owner/income-expenditure';
import OwnerBreadcrumb from '@/app/owner/owner-breadcrumb';
import Overview from '@/components/overview/overview';
import Title from '@/components/title';
import { IIncomeExpenditure, IOverviewByOwnerRes } from '@/interfaces/dashboard';
import { getIncomeExpenditureByOwner, getOverviewByOwner } from '@/services/dashboard-service';
import { cookies } from 'next/headers';

const OwnerPage = async () => {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    let overview: IOverviewByOwnerRes | null = null;
    let incomeExpenditure: IIncomeExpenditure[] = [];
    const year = new Date().getFullYear();

    try {
        [overview, incomeExpenditure] = await Promise.all([
            getOverviewByOwner(accessToken!),
            getIncomeExpenditureByOwner(accessToken!),
        ]);
    } catch (error) {
        console.log(error);
    }

    console.log('🚀 ~ OwnerPage ~ overview:', overview);
    console.log('🚀 ~ OwnerPage ~ incomeExpenditure:', incomeExpenditure);

    return (
        <div>
            <OwnerBreadcrumb />
            <Title level={2}>Tóm tắt</Title>
            {overview && <Overview overview={overview} />}
            <Title
                level={2}
                style={{
                    marginTop: '40px',
                }}
            >
                Biến động thu nhập theo tháng/{year}
            </Title>
            <IncomeExpenditure incomeExpenditures={incomeExpenditure} />
        </div>
    );
};

export default OwnerPage;
