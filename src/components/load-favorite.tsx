import SaveFavorite from '@/components/save-favorite';
import { countFavorites } from '@/services/property-interaction-service';
import { cookies } from 'next/headers';

const LoadFavorite = async () => {
    let count = 0;

    try {
        const cookiesStore = cookies();
        const accessToken = cookiesStore.get('accessToken')?.value || '';

        const res = await countFavorites(accessToken);

        count = res.data;
    } catch (error) {
        console.log(error);
    }

    return <SaveFavorite count={count} />;
};

export default LoadFavorite;
