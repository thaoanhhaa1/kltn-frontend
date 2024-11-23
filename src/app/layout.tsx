import Socket from '@/components/socket';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { envConfig } from '@/config/envConfig';
import { config } from '@/config/wagmiConfig';
import AppKitProvider from '@/context/wagmi';
import { cn } from '@/lib/utils';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { cookieToInitialState } from 'wagmi';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
});

export const metadata: Metadata = {
    title: {
        template: `%s | ${envConfig.NEXT_PUBLIC_WEB_NAME}`,
        default: envConfig.NEXT_PUBLIC_WEB_NAME,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const initialState = cookieToInitialState(config, headers().get('cookie'));

    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}>
                <AppKitProvider initialState={initialState}>
                    <AntdRegistry>
                        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
                            <TooltipProvider>{children}</TooltipProvider>
                            <ToastContainer />
                            <Socket />
                        </ThemeProvider>
                    </AntdRegistry>
                </AppKitProvider>
                <SpeedInsights />
            </body>
        </html>
    );
}
