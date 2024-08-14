export async function POST() {
    return new Response(
        JSON.stringify({
            status: 200,
            message: 'Sign out',
        }),
        {
            status: 200,
            headers: {
                'Set-Cookie': `refreshToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; Secure, accessToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; Secure`,
            },
        },
    );
}
