import { envConfig } from '@/config/envConfig';

export const baseOpenGraph = {
    siteName: envConfig.NEXT_PUBLIC_WEB_NAME,
    locale: 'en_US',
    type: 'website',
};
