import Chatbot from '@/components/chatbot/chatbot';
import Header from '@/components/header/header';
import SaveFavorite from '@/components/save-favorite';
import SaveConversations from '@/components/save-notifications';
import SaveUser from '@/components/save-user';
import { initDataTable } from '@/constants/init-data';
import { IConversation } from '@/interfaces/chat';
import { ITable } from '@/interfaces/table';
import { IUser } from '@/interfaces/user';
import { getConversationsByUserServices } from '@/services/conversation-service';
import { countNotifications } from '@/services/notification-service';
import { countFavorites } from '@/services/property-interaction-service';
import { getMe } from '@/services/user-service';
import { cookies } from 'next/headers';

export default async function BaseLayout({ children }: { children: React.ReactNode }) {
    let user: IUser | undefined;
    let notificationsCount: number | undefined;
    const conversations: ITable<IConversation> = initDataTable;
    let countFavorite = 0;

    try {
        const cookiesStore = cookies();
        const accessToken = cookiesStore.get('accessToken')?.value || '';

        const [res, count, conversationsRes, countFavoriteRes] = await Promise.all([
            getMe(accessToken),
            countNotifications(accessToken),
            getConversationsByUserServices(accessToken),
            countFavorites(accessToken),
        ]);

        user = res;
        notificationsCount = count.data;
        conversations.data = conversationsRes.data;
        countFavorite = countFavoriteRes.data;
    } catch (error) {
        console.log(error);
    }

    return (
        <main className="min-h-screen flex flex-col">
            <SaveFavorite count={countFavorite} />
            <SaveUser user={user} />
            <SaveConversations conversations={conversations} user={user} />
            <Header user={user} notificationsCount={notificationsCount ?? 0} />
            <div className="max-w-6xl w-full mx-auto px-6 flex-1">{children}</div>
            <Chatbot user={user} />
        </main>
    );
}
