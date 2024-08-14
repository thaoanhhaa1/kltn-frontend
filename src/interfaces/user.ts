import { Role } from '@/types/role';

export interface IUser {
    user_id: number;
    email: string;
    name: string;
    user_types: Role[];
    avatar: string | null;
    phone_number: string | null;
    wallet_address: string | null;
    created_at: string;
    updated_at: string;
}
