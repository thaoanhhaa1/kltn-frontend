import { getDictionary } from '@/app/[lang]/dictionaries';
import Header from '@/components/header/header';

export default async function BaseLayout({
    children,
    params: { lang },
}: {
    children: React.ReactNode;
    params: {
        lang: string;
    };
}) {
    const dict = await getDictionary(lang);

    return (
        <main>
            <Header
                params={{
                    lang,
                }}
                modeDict={dict.mode}
                headerDict={dict.header}
            />
            <div className="max-w-6xl mx-auto">{children}</div>
        </main>
    );
}
