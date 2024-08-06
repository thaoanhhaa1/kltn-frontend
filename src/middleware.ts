import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

let locales = ['en', 'vi', 'nl'];
let defaultLocale = 'vi';

const authRoutes = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password', '/verify-email'];
const privateRoutes = ['/dashboard', '/owner', '/user'];

const checkAuth = ({ isAuth, request }: { isAuth: boolean; request: NextRequest }) => {
    if (isAuth && authRoutes.some((route) => request.nextUrl.pathname.includes(route))) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (!isAuth && privateRoutes.some((route) => request.nextUrl.pathname.includes(route))) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }
};

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const cookiesStore = cookies();
    const accessToken = cookiesStore.get('accessToken')?.value;
    const refreshToken = cookiesStore.get('refreshToken')?.value;
    const isAuth = !!accessToken || !!refreshToken;

    if (pathname.startsWith('/api')) return;

    const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

    if (pathnameHasLocale) {
        const res = checkAuth({ isAuth, request });

        if (res) return res;
        return;
    }

    const { headers } = request;
    const acceptLanguage = headers.get('accept-language');

    const languages = new Negotiator({
        headers: {
            'accept-language': acceptLanguage || defaultLocale,
        },
    }).languages();

    const locale = match(languages, locales, defaultLocale);
    request.nextUrl.pathname = `/${locale}${pathname}`;

    const res = checkAuth({ isAuth, request });

    if (res) return res;

    return NextResponse.redirect(request.nextUrl);
}

export const config = {
    // matcher: ['/dashboard/:path*', '/owner/:path*', '/user/:path*'],
    matcher: ['/((?!_next).*)'],
};
