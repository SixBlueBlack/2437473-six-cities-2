import {CityType} from '../../../../types/city-type.enum.js';
import {HousingType} from '../../../../types/housing-type.enum.js';
import {ConvenienceType} from '../../../../types/convenience-type.enum.js';
import {Coordinates} from '../../../../types/coordinates.type.js';
import {Expose, Type} from 'class-transformer';
import UserRdo from '../../user/rdo/user.rdo.js';

export default class OfferRdo {
  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public postDate!: Date;

  @Expose()
  public city!: CityType;

  @Expose()
  public imagePreview!: string;

  @Expose()
  public photos!: string[];

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavourite!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public housingType!: HousingType;

  @Expose()
  public roomsNumber!: number;

  @Expose()
  public guestsNumber!: number;

  @Expose()
  public rentalPrice!: number;

  @Expose()
  public conveniences!: ConvenienceType[];

  @Expose({name: 'author'})
  @Type(() => UserRdo)
  public author!: string;

  @Expose()
  public commentsNumber!: number;

  @Expose()
  public coordinates!: Coordinates;
}
