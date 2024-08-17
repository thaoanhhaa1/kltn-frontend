import logo from '@/assets/images/logo.png';
import { envConfig } from '@/config/envConfig';
import { HOME } from '@/path';
import Image from 'next/image';
import Link from 'next/link';

const Logo = ({ lang }: { lang: string }) => {
    return (
        <Link href={`/${lang}${HOME}`} className="w-9 h-9">
            <Image width={36} height={36} alt={envConfig.NEXT_PUBLIC_WEB_NAME} src={logo} />
        </Link>
    );
};

export default Logo;
