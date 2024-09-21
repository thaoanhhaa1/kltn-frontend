import Chatbot from '@/components/chatbot/chatbot';
import Header from '@/components/header/header';
import SaveUser from '@/components/save-user';
import { IUser } from '@/interfaces/user';
import { countNotifications } from '@/services/notification-service';
import { getMe } from '@/services/user-service';
import { cookies } from 'next/headers';

export default async function BaseLayout({ children }: { children: React.ReactNode }) {
    let user: IUser | undefined;
    let notificationsCount: number | undefined;

    try {
        const cookiesStore = cookies();
        const accessToken = cookiesStore.get('accessToken')?.value || '';

        const [res, count] = await Promise.all([getMe(accessToken), countNotifications(accessToken)]);

        user = res;
        notificationsCount = count.data;
    } catch (error) {}

    return (
        <main>
            <SaveUser user={user} />
            <Header user={user} notificationsCount={notificationsCount ?? 0} />
            <div className="max-w-6xl mx-auto px-6">{children}</div>
            <Chatbot user={user} />
        </main>
    );
}
