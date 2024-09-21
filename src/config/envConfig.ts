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
});

if (!envParser.success) {
    console.error(envParser.error.errors);
    process.exit(1);
}

export const envConfig = envParser.data;

export const isClient = typeof window !== 'undefined';
