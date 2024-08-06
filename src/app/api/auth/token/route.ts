import { IAuthResponse } from '@/schemas/auth.schema';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    const body = await request.json();
    const authResponse: IAuthResponse = body;

    const { refreshToken, accessToken } = authResponse.token;

    if (!accessToken?.token) {
        return new Response(
            JSON.stringify({
                status: 400,
                message: 'Invalid request body',
                error: 'Invalid request body',
            }),
            {
                status: 400,
            },
        );
    }

    return new Response(
        JSON.stringify({
            status: 200,
            message: 'Token saved',
        }),
        {
            status: 200,
            headers: {
                'Set-Cookie': `refreshToken=${refreshToken.token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${refreshToken.expiresIn}; Secure, accessToken=${accessToken.token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${accessToken.expiresIn}; Secure`,
            },
        },
    );
}
