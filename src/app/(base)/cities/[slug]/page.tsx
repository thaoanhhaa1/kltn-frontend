import CitySearch from '@/app/(base)/cities/[slug]/city-search';
import HomeButton from '@/components/button/home-button';
import Title from '@/components/title';
import { locations } from '@/constants/init-data';
import { Result } from 'antd';

const CityPage = async ({ params: { slug } }: { params: { slug: string } }) => {
    const location = locations.find((location) => {
        return location.href === `/${slug}`;
    });

    if (!location)
        return (
            <Result
                status="404"
                title="404"
                subTitle="Xin lỗi, trang bạn đang tìm kiếm không tồn tại."
                extra={<HomeButton />}
            />
        );

    return (
        <div className="pb-5">
            <Title
                title={location.title}
                level={3}
                style={{
                    textAlign: 'center',
                    margin: 20,
                }}
            >
                Bất động sản ở {location.title}
            </Title>
            <CitySearch city={location.title} />
        </div>
    );
};

export default CityPage;
