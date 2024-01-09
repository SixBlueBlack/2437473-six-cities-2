import {Coordinates} from '../../../../types/coordinates.type';
import {HousingType} from '../../../../types/housing-type.enum.js';
import {ConvenienceType} from '../../../../types/convenience-type.enum.js';
import {CityType} from '../../../../types/city-type.enum.js';
import {
  IsArray,
  IsBoolean,
  IsDateString, IsEnum,
  IsInt, IsObject, IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength
} from 'class-validator';

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(10, {message: 'Minimum title length must be 10'})
  @MaxLength(100, {message: 'Maximum title length must be 10'})
  public title?: string;

  @IsOptional()
  @MinLength(20, {message: 'Minimum description length must be 20'})
  @MaxLength(1024, {message: 'Maximum description length must be 1024'})
  public description?: string;

  @IsOptional()
  @IsDateString({}, {message: 'postDate must be valid ISO date'})
  public postDate?: Date;

  @IsOptional()
  @IsEnum(CityType, {message: 'city must be one of the enum elements'})
  public city!: CityType;

  @IsOptional()
  @IsString({message: 'imagePreview must be path to image'})
  public imagePreview?: string;

  @IsOptional()
  @IsArray({message: 'photos must be the array'})
  @IsString({each: true, message: 'must be path to photo'})
  public photos?: string[];

  @IsOptional()
  @IsBoolean({message: 'isPremium must be boolean'})
  public isPremium?: boolean;

  @IsOptional()
  @IsEnum(HousingType, {message: 'housingType must be one of the enum elements'})
  public housingType?: HousingType;

  @IsOptional()
  @Min(1, {message: 'Minimum roomsNumber must be 1'})
  @Max(8, {message: 'Maximum roomsNumber must be 8'})
  @IsInt({message: 'roomsNumber must be int'})
  public roomsNumber?: number;

  @IsOptional()
  @Min(1, {message: 'Minimum guestsNumber must be 1'})
  @Max(10, {message: 'Maximum guestsNumber must be 10'})
  @IsInt({message: 'guestsNumber must be int'})
  public guestsNumber?: number;

  @IsOptional()
  @Min(100, {message: 'Minimum rentalPrice must be 100'})
  @Max(100000, {message: 'Maximum rentalPrice must be 100000'})
  public rentalPrice?: number;

  @IsOptional()
  @IsArray({message: 'conveniences must be array'})
  @IsEnum(ConvenienceType, {each: true, message: 'convenience must be one of the enum elements'})
  public conveniences?: ConvenienceType[];

  @IsOptional()
  @IsObject({message: 'coordinates must be a Coordinates object'})
  public coordinates?: Coordinates;
}
