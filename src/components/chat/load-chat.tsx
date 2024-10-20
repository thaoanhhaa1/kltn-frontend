import SaveConversations from '@/components/save-notifications';
import { initDataTable } from '@/constants/init-data';
import { IConversation } from '@/interfaces/chat';
import { ITable } from '@/interfaces/table';
import { IUser } from '@/interfaces/user';
import { getConversationsByUserServices } from '@/services/conversation-service';
import { getMe } from '@/services/user-service';
import { cookies } from 'next/headers';

const LoadChat = async () => {
    let user: IUser | undefined;
    const conversations: ITable<IConversation> = initDataTable;

    try {
        const cookiesStore = cookies();
        const accessToken = cookiesStore.get('accessToken')?.value || '';

        const [res, conversationsRes] = await Promise.all([
            getMe(accessToken),
            getConversationsByUserServices(accessToken),
        ]);

        user = res;
        conversations.data = conversationsRes.data;
    } catch (error) {
        console.log(error);
    }

    return <SaveConversations conversations={conversations} user={user} />;
};

export default LoadChat;
