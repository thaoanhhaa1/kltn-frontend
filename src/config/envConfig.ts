import { z } from 'zod';

const envSchema = z.object({
    NEXT_PUBLIC_API_URL: z.string(),
    NEXT_PUBLIC_WEB_NAME: z.string(),
    NEXT_PUBLIC_ADDRESS_ENDPOINT: z.string(),
    NEXT_PUBLIC_PROJECT_ID: z.string(),
    NEXT_PUBLIC_WAGMI_NAME: z.string(),
    NEXT_PUBLIC_WAGMI_DESCRIPTION: z.string(),
    NEXT_PUBLIC_WAGMI_URL: z.string(),
    NEXT_PUBLIC_WAGMI_ICONS: z.array(z.string()),
    NEXT_PUBLIC_WAGMI_REDIRECT_NATIVE: z.string(),
    NEXT_PUBLIC_WAGMI_REDIRECT_UNIVERSAL: z.string(),
    NEXT_PUBLIC_TINY_MCE_API_KEY: z.string(),
    NEXT_PUBLIC_FIREBASE_API_KEY: z.string(),
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string(),
    NEXT_PUBLIC_FIREBASE_AUTH_PROJECT_ID: z.string(),
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string(),
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string(),
    NEXT_PUBLIC_FIREBASE_APP_ID: z.string(),
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string(),
    NEXT_PUBLIC_SOCKET_ENDPOINT: z.string(),
    NEXT_PUBLIC_DOC_VIEWER: z.string(),
    NEXT_PUBLIC_OTP_EXPIRATION: z.coerce.number(),
    NEXT_PUBLIC_GOONG_API_KEY: z.string(),
    NEXT_PUBLIC_CHAIN_ID: z.coerce.number(),
    NEXT_PUBLIC_CHAIN_NAME: z.string(),
    NEXT_PUBLIC_CHAIN_NPC_URL: z.string(),
    NEXT_PUBLIC_CHAIN_DECIMALS: z.coerce.number(),
    NEXT_PUBLIC_CHAIN_SYMBOL: z.string(),
    NEXT_PUBLIC_CHAIN_CURRENCY: z.string(),
    NEXT_PUBLIC_URL: z.string(),
});

const envParser = envSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL!,
    NEXT_PUBLIC_WEB_NAME: process.env.NEXT_PUBLIC_WEB_NAME!,
    NEXT_PUBLIC_ADDRESS_ENDPOINT: process.env.NEXT_PUBLIC_ADDRESS_ENDPOINT!,
    NEXT_PUBLIC_PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID!,
    NEXT_PUBLIC_WAGMI_NAME: process.env.NEXT_PUBLIC_WAGMI_NAME!,
    NEXT_PUBLIC_WAGMI_DESCRIPTION: process.env.NEXT_PUBLIC_WAGMI_DESCRIPTION!,
    NEXT_PUBLIC_WAGMI_URL: process.env.NEXT_PUBLIC_WAGMI_URL!,
    NEXT_PUBLIC_WAGMI_ICONS: process.env.NEXT_PUBLIC_WAGMI_ICONS!.split(','),
    NEXT_PUBLIC_WAGMI_REDIRECT_NATIVE: process.env.NEXT_PUBLIC_WAGMI_REDIRECT_NATIVE!,
    NEXT_PUBLIC_WAGMI_REDIRECT_UNIVERSAL: process.env.NEXT_PUBLIC_WAGMI_REDIRECT_UNIVERSAL!,
    NEXT_PUBLIC_TINY_MCE_API_KEY: process.env.NEXT_PUBLIC_TINY_MCE_API_KEY!,
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    NEXT_PUBLIC_FIREBASE_AUTH_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_AUTH_PROJECT_ID!,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
    NEXT_PUBLIC_SOCKET_ENDPOINT: process.env.NEXT_PUBLIC_SOCKET_ENDPOINT!,
    NEXT_PUBLIC_DOC_VIEWER: process.env.NEXT_PUBLIC_DOC_VIEWER!,
    NEXT_PUBLIC_OTP_EXPIRATION: process.env.NEXT_PUBLIC_OTP_EXPIRATION!,
    NEXT_PUBLIC_GOONG_API_KEY: process.env.NEXT_PUBLIC_GOONG_API_KEY!,
    NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID!,
    NEXT_PUBLIC_CHAIN_NAME: process.env.NEXT_PUBLIC_CHAIN_NAME!,
    NEXT_PUBLIC_CHAIN_NPC_URL: process.env.NEXT_PUBLIC_CHAIN_NPC_URL!,
    NEXT_PUBLIC_CHAIN_DECIMALS: process.env.NEXT_PUBLIC_CHAIN_DECIMALS!,
    NEXT_PUBLIC_CHAIN_SYMBOL: process.env.NEXT_PUBLIC_CHAIN_SYMBOL!,
    NEXT_PUBLIC_CHAIN_CURRENCY: process.env.NEXT_PUBLIC_CHAIN_CURRENCY!,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL!,
});

if (!envParser.success) {
    console.error(envParser.error.errors);
    process.exit(1);
}

export const envConfig = envParser.data;

export const isClient = typeof window !== 'undefined';
