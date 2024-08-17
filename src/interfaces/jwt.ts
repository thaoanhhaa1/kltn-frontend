import { Role } from '@/types/role';

export interface IPayloadJWT {
    id: number;
    email: string;
    userTypes: Role[];
    iat: number;
    exp: number;
}
