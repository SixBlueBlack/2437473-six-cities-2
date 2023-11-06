import {FileReaderInterface} from './file-reader.interface.js';
import {readFileSync} from 'node:fs';
import {Offer} from '../../types/offer.type.js';
import {CityType} from '../../types/city-type.enum.js';
import {HousingType} from '../../types/housing-type.enum.js';
import {ConvenienceType} from '../../types/convenience-type.enum.js';
import {User} from '../../types/user.type.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public filename: string) {
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, {encoding: 'utf-8'});
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      return [];
    }

    // @ts-ignore
    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([title, description, postDate, city, imagePreview, photos, isPremium, isFavourite, rating, housingType, roomsNumber, guestsNumber, rentalPrice, conveniences, author, commentsNumber, coordinates]) => ({
        title,
        description,
        postDate: new Date(postDate),
        city: city as CityType,
        imagePreview,
        photos: photos.split(';'),
        isPremium: isPremium as unknown as boolean,
        isFavourite: isFavourite as unknown as boolean,
        rating: Number.parseInt(rating, 10),
        housingType: housingType as HousingType,
        roomsNumber: Number.parseInt(roomsNumber, 10),
        guestsNumber: Number.parseInt(guestsNumber, 10),
        rentalPrice: Number.parseInt(rentalPrice, 10),
        conveniences: conveniences.split(';') as unknown as ConvenienceType,
        author: author as unknown as User,
        commentsNumber: Number.parseInt(commentsNumber, 10),
        coordinates: coordinates.split(',').map((number) =>
          Number.parseFloat(number)) as unknown as ConvenienceType,
      }));
  }
}
