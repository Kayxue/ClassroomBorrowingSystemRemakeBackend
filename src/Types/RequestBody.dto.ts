import {IsNotEmpty, IsString} from "class-validator"

export class InsertUserData{
    @IsString()
    @IsNotEmpty()
    public readonly username:string

    @IsString()
    @IsNotEmpty()
    public readonly email:string

    @IsString()
    @IsNotEmpty()
    public readonly password:string

    @IsString()
    @IsNotEmpty()
    public readonly department:string

    @IsString()
    @IsNotEmpty()
    public readonly extension:string

    @IsString()
    @IsNotEmpty()
    public readonly role:string
}