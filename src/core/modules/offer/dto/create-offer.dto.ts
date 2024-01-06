import {CityType} from '../../../../types/city-type.enum.js';
import {HousingType} from '../../../../types/housing-type.enum.js';
import {ConvenienceType} from '../../../../types/convenience-type.enum.js';
import {Coordinates} from '../../../../types/coordinates.type.js';

export default class CreateOfferDto {
  title!: string;
  description!: string;
  postDate!: Date;
  city!: CityType;
  imagePreview!: string;
  photos!: string[];
  isPremium!: boolean;
  isFavourite!: boolean;
  rating!: number;
  housingType!: HousingType;
  roomsNumber!: number;
  guestsNumber!: number;
  rentalPrice!: number;
  conveniences!: ConvenienceType[];
  author!: string;
  commentsNumber!: number;
  coordinates!: Coordinates;
}
