import {OfferGeneratorInterface} from './offer-generator.interface.js';
import {MockData} from '../../../types/mock-data.type.js';
import {generateRandomValue, getRandomItem} from '../../helpers/random.js';
import {CityType} from '../../../types/city-type.enum.js';
import {HousingType} from '../../../types/housing-type.enum.js';
import dayjs from 'dayjs';

const MIN_PRICE = 1000;
const MAX_PRICE = 500000;

export class OfferGenerator implements OfferGeneratorInterface {
  constructor(private readonly mockData: MockData) {
  }

  public generate(): string {
    const name = getRandomItem<string>(this.mockData.names);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const postDate = dayjs().subtract(generateRandomValue(1,7),'day').toISOString();
    const city = getRandomItem([CityType.Paris, CityType.Cologne, CityType.Brussels, CityType.Amsterdam,
      CityType.Hamburg, CityType.Dusseldorf]);
    const imagePreview = getRandomItem<string>(this.mockData.imagePreviews);
    const photos = getRandomItem<string>(this.mockData.images);
    const isPremium = getRandomItem([true, false]);
    const isFavourite = getRandomItem([true, false]);
    const rating = generateRandomValue(1,5);
    const housingType = getRandomItem([HousingType.Apartment, HousingType.House,
      HousingType.Room, HousingType.Hotel]);
    const roomsNumber = generateRandomValue(1,5);
    const guestsNumber = generateRandomValue(1,10);
    const rentalPrice = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const conveniences = getRandomItem<string>(this.mockData.conveniences);
    const author = getRandomItem<string>(this.mockData.authors);
    const commentsNumber = getRandomItem<string>(this.mockData.commentsNumbers);
    const coordinates = getRandomItem<string>(this.mockData.coordinates);

    return [
      name, description, postDate,
      city, imagePreview, photos, isPremium,
      isFavourite, rating, housingType, roomsNumber,
      guestsNumber, rentalPrice, conveniences,
      author, commentsNumber, coordinates
    ].join('\t');
  }
}
