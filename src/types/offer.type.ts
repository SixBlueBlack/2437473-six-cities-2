import {CityType} from './city-type.enum.js';
import {HousingType} from './housing-type.enum.js';
import {ConvenienceType} from './convenience-type.enum.js';
import {User} from './user.type.js';
import {Coordinates} from './coordinates.type.js';

export type Offer = {
  title: string;
  description: string;
  postDate: Date;
  city: CityType;
  imagePreview: string;
  photos: string[];
  isPremium: boolean;
  isFavourite: boolean;
  rating: number;
  housingType: HousingType;
  roomsNumber: number;
  guestsNumber: number;
  rentalPrice: number;
  conveniences: ConvenienceType[];
  author: User;
  commentsNumber: number;
  coordinates: Coordinates;
}
