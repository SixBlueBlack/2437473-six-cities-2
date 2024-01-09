import {IsString} from 'class-validator';

export class UpdateUserDto {
  @IsString({message: 'avatar must be string'})
  public avatar?: string;
}
