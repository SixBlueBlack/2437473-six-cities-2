import {IsDateString, IsMongoId, IsString, Length, Max, Min} from 'class-validator';

export default class CreateCommentDto {
  @IsString({message: 'text must be string'})
  @Length(5, 24, {message: 'Min length for name is 5, max is 24'})
  public text!: string;

  @IsDateString({}, {message: 'postDate must be valid ISO date'})
  public postDate!: Date;

  @Min(1, {message: 'Minimum rating must be 1'})
  @Max(5, {message: 'Maximum rating must be 5'})
  public rating!: number;

  public author!: string;

  @IsMongoId({message: 'author field must be valid an id'})
  public offerId!: string;
}
