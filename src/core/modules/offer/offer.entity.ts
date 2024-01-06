import typegoose, {defaultClasses, getModelForClass, Ref} from '@typegoose/typegoose';
import {CityType} from '../../../types/city-type.enum.js';
import {HousingType} from '../../../types/housing-type.enum.js';
import {ConvenienceType} from '../../../types/convenience-type.enum.js';
import {Coordinates} from '../../../types/coordinates.type.js';
import {UserEntity} from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;

export interface OfferEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  }
})
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({required: true, trim: true, minlength: 10, maxlength: 100})
  public title!: string;

  @prop({required: true, trim: true, minlength: 20, maxlength: 1024})
  public description!: string;

  @prop({required: true})
  public postDate!: Date;

  @prop({
    required: true,
    type: () => String,
    enum: CityType
  })
  public city!: CityType;

  @prop({required: true})
  public imagePreview!: string;

  @prop({
    required: true,
    type: () => String
  })
  public photos!: string[];

  @prop({required: true})
  public isPremium!: boolean;

  @prop({required: true})
  public isFavourite!: boolean;

  @prop({required: true, min: 1, max: 5})
  public rating!: number;

  @prop({
    required: true,
    type: () => String,
    enum: HousingType
  })
  public housingType!: HousingType;

  @prop({required: true, min: 1, max: 8})
  public roomsNumber!: number;

  @prop({required: true, min: 1, max: 10})
  public guestsNumber!: number;

  @prop({required: true, min: 100, max: 100000})
  public rentalPrice!: number;

  @prop({
    required: true,
    type: () => String,
    enum: ConvenienceType
  })
  public conveniences!: ConvenienceType[];

  @prop({
    required: true,
    ref: UserEntity
  })
  public author!: Ref<UserEntity>;

  @prop({default: 0})
  public commentsNumber!: number;

  @prop({required: true})
  public coordinates!: Coordinates;
}

export const OfferModel = getModelForClass(OfferEntity);
