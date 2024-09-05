/** @type {import('next').NextConfig} */
const nextConfig = {
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
    images: {
        remotePatterns: [
            {
                hostname: 'firebasestorage.googleapis.com',
            },
        ],
    },
    webpack: (config) => {
        config.externals.push('pino-pretty' /* add any other modules that might be causing the error */);
        return config;
    },
};

export default nextConfig;
