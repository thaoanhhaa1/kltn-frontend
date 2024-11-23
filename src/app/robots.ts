import { envConfig } from '@/config/envConfig';
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/owner/',
                '/dashboard/',
                '/chat',
                '/contracts/',
                '/favorite',
                '/payments',
                '/rental-requests',
                '/reports/',
                '/user/',
            ],
        },
        sitemap: `${envConfig.NEXT_PUBLIC_WEB_NAME}/sitemap.xml`,
    };
}
