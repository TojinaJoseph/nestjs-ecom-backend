import { Role } from "../enums/roles-type.enum";

export interface ActiveUserData{
    sub: number;
    email: string;
    role: Role
}