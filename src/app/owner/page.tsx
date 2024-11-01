import OwnerBreadcrumb from '@/app/owner/owner-breadcrumb';
import Overview from '@/components/overview/overview';
import Title from '@/components/title';
import { IOverviewByOwnerRes } from '@/interfaces/dashboard';
import { getOverviewByOwner } from '@/services/dashboard-service';
import { cookies } from 'next/headers';

const OwnerPage = async () => {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    let overview: IOverviewByOwnerRes | null = null;

    try {
        overview = await getOverviewByOwner(accessToken!);
    } catch (error) {
        console.log(error);
    }

    console.log('🚀 ~ OwnerPage ~ overview:', overview);

    return (
        <div>
            <OwnerBreadcrumb />
            <Title level={2}>Tóm tắt</Title>
            {overview && <Overview overview={overview} />}
        </div>
    );
};

export default OwnerPage;
