import { HOME, SIGN_IN } from '@/path';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const authRoutes = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password', '/verify-email'];
const privateRoutes = ['/dashboard', '/owner', '/user'];

const checkAuth = ({ isAuth, request }: { isAuth: boolean; request: NextRequest }) => {
    if (isAuth && authRoutes.some((route) => request.nextUrl.pathname.includes(route))) {
        return NextResponse.redirect(new URL(HOME, request.url));
    }

    if (!isAuth && privateRoutes.some((route) => request.nextUrl.pathname.includes(route))) {
        return NextResponse.redirect(new URL(SIGN_IN, request.url));
    }
};

export function middleware(request: NextRequest) {
    const cookiesStore = cookies();
    const accessToken = cookiesStore.get('accessToken')?.value;
    // const refreshToken = cookiesStore.get('refreshToken')?.value;
    const refreshToken = '';
    const isAuth = !!accessToken || !!refreshToken;

    const res = checkAuth({ isAuth, request });

    if (res) return res;

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/owner/:path*', '/user/:path*'],
};
