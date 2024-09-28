import { Role } from '@/types/role';
import { UserStatus } from '@/types/user-status';

export interface IBaseUserEmbed {
    userId: string;
    name: string;
    avatar: string | null;
}

export interface IUser extends IBaseUserEmbed {
    email: string;
    userTypes: Role[];
    status: UserStatus;
    phoneNumber: string | null;
    walletAddress: `0x${string}` | null;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}
