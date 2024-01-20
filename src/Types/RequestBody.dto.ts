import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { Roles } from "./Types"

export class InsertUserData {
    @IsString()
    @IsNotEmpty()
    public readonly username: string

    @IsString()
    @IsNotEmpty()
    public readonly email: string

    @IsString()
    @IsNotEmpty()
    public readonly password: string

    @IsString()
    @IsNotEmpty()
    public readonly department: string

    @IsString()
    @IsNotEmpty()
    public readonly extension: string

    @IsString()
    @IsEnum(Roles)
    @IsNotEmpty()
    public readonly role: string
}

export class UpdateUserPasswordData{
    @IsString()
    @IsNotEmpty()
    public readonly userId:string

    @IsString()
    @IsNotEmpty()
    public readonly oldPassword:string

    @IsString()
    @IsNotEmpty()
    public readonly newPassword:string

    @IsString()
    @IsOptional()
    public readonly confirmPassword?:string
}

export class DeleteUserData{
    @IsString()
    @IsNotEmpty()
    public readonly userId:string
}