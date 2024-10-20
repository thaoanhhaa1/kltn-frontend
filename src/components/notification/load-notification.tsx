import NotificationCount from '@/components/notification/notification-count';
import { countNotifications } from '@/services/notification-service';
import { cookies } from 'next/headers';

const LoadNotification = async () => {
    let notificationsCount: number = 0;

    try {
        const cookiesStore = cookies();
        const accessToken = cookiesStore.get('accessToken')?.value || '';

        const count = await countNotifications(accessToken);

        notificationsCount = count.data;
    } catch (error) {
        console.log(error);
    }

    return <NotificationCount count={notificationsCount} />;
};

export default LoadNotification;
