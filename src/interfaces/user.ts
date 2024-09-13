import { Role } from '@/types/role';
import { UserStatus } from '@/types/user-status';

export interface IUser {
    userId: string;
    email: string;
    name: string;
    userTypes: Role[];
    status: UserStatus;
    avatar: string | null;
    phoneNumber: string | null;
    walletAddress: `0x${string}` | null;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}
