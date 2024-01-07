import {Coordinates} from '../../../../types/coordinates.type';
import {CityType} from '../../../../types/city-type.enum';
import {HousingType} from '../../../../types/housing-type.enum';
import {ConvenienceType} from '../../../../types/convenience-type.enum';


export class UpdateOfferDto {
  title?: string;
  description?: string;
  postDate?: Date;
  city?: CityType;
  imagePreview?: string;
  photos?: string[];
  isPremium?: boolean;
  isFavourite?: boolean;
  rating?: number;
  housingType?: HousingType;
  roomsNumber?: number;
  guestsNumber?: number;
  rentalPrice?: number;
  conveniences?: ConvenienceType[];
  author?: string;
  commentsNumber?: number;
  coordinates?: Coordinates;
}
