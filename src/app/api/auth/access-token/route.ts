import { cookies } from 'next/headers';

export async function POST() {
    const cookiesStore = cookies();
    const accessToken = cookiesStore.get('accessToken')?.value || '';

    return new Response(
        JSON.stringify({
            status: 200,
            message: 'Access token',
            data: accessToken,
        }),
        {
            status: 200,
        },
    );
}
