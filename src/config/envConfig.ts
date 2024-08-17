import { z } from 'zod';

const envSchema = z.object({
    NEXT_PUBLIC_API_URL: z.string(),
    NEXT_PUBLIC_WEB_NAME: z.string(),
});

const envParser = envSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL!,
    NEXT_PUBLIC_WEB_NAME: process.env.NEXT_PUBLIC_WEB_NAME!,
});

if (!envParser.success) {
    console.error(envParser.error.errors);
    process.exit(1);
}

export const envConfig = envParser.data;

export const isClient = typeof window !== 'undefined';
