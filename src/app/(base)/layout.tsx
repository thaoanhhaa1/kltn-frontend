import Header from '@/components/header/header';

export default async function BaseLayout({ children }: { children: React.ReactNode }) {
    return (
        <main>
            <Header />
            <div className="max-w-6xl mx-auto">{children}</div>
        </main>
    );
}
