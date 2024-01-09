import {UserType} from '../../../../types/user-type.enum.js';
import {IsEmail, IsEnum, IsString, Length} from 'class-validator';

export default class CreateUserDto {
  @IsString({message: 'name must be string'})
  @Length(1, 15, {message: 'Min length for name is 1, max is 15'})
  public name!: string;

  @IsEmail({}, {message: 'email must be valid address'})
  public email!: string;

  @IsString({message: 'password must be string'})
  @Length(6, 12, {message: 'Min length for password is 6, max is 12'})
  public password!: string;

  @IsEnum(UserType, {message: 'type must be one of the enum elements'})
  public type!: UserType;
}
