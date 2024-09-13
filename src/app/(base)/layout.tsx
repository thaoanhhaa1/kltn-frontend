import Chatbot from '@/components/chatbot/chatbot';
import Header from '@/components/header/header';
import { IUser } from '@/interfaces/user';
import { getMe } from '@/services/user-service';
import { cookies } from 'next/headers';

export default async function BaseLayout({ children }: { children: React.ReactNode }) {
    let user: IUser | undefined;

    try {
        const cookiesStore = cookies();
        const accessToken = cookiesStore.get('accessToken')?.value || '';

        const res = await getMe(accessToken);

        user = res;
    } catch (error) {}

    return (
        <main>
            <Header user={user} />
            <div className="max-w-6xl mx-auto px-6">{children}</div>
            <Chatbot user={user} />
        </main>
    );
}
