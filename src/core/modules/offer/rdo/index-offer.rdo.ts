import {CityType} from '../../../../types/city-type.enum.js';
import {HousingType} from '../../../../types/housing-type.enum.js';
import {Expose} from 'class-transformer';

export default class IndexOfferRdo {
  @Expose()
  public title!: string;

  @Expose()
  public postDate!: Date;

  @Expose()
  public city!: CityType;

  @Expose()
  public imagePreview!: string;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavourite!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public housingType!: HousingType;

  @Expose()
  public rentalPrice!: number;

  @Expose()
  public commentsNumber!: number;
}
