import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsEnum(Role)
    role: Role;

    @IsOptional()
    isEnable?: boolean = true;
}
