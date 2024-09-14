import ConnectWallet from '@/app/(base)/user/wallet/connect-wallet';
import WalletManage from '@/app/(base)/user/wallet/wallet-manage';
import Forbidden from '@/components/forbidden';
import SaveUser from '@/components/save-user';
import { IUser } from '@/interfaces/user';
import { SIGN_IN } from '@/path';
import { getMe } from '@/services/user-service';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const WalletPage = async () => {
    let user: IUser | undefined;

    try {
        const cookiesStore = cookies();
        const accessToken = cookiesStore.get('accessToken')?.value || '';

        user = await getMe(accessToken);
    } catch (error) {}

    if (!user) return redirect(SIGN_IN);
    if (!(user.userTypes.includes('owner') || user.userTypes.includes('renter'))) return <Forbidden />;

    return (
        <div>
            {(user.walletAddress && <WalletManage address={user.walletAddress} />) || <ConnectWallet />}
            <SaveUser user={user} />
        </div>
    );
};

export default WalletPage;
