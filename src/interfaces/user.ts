import { Role } from '@/types/role';
import { UserStatus } from '@/types/user-status';

export interface IBaseUserEmbed {
    userId: string;
    name: string;
    avatar: string | null;
}

export interface IBaseUser extends IBaseUserEmbed {
    email: string;
    phoneNumber: string | null;
}

export interface IUser extends IBaseUser {
    userTypes: Role[];
    status: UserStatus;
    walletAddress: `0x${string}` | null;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}
