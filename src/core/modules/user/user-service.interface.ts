import CreateUserDto from './dto/create-user.dto.js';
import {DocumentType} from '@typegoose/typegoose';
import {UserEntity} from './user.entity.js';
import LoginUserDto from './dto/login-user.dto.js';
import {OfferEntity} from '../offer/offer.entity.js';

export interface UserServiceInterface {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;

  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;

  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;

  findById(userId: string): Promise<DocumentType<UserEntity> | null>;

  verifyUser(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null>;

  findFavouriteOffers(userId: string): Promise<DocumentType<OfferEntity>[]>;

  addToFavorites(offerId: string, userId: string): Promise<void>;

  deleteFromFavorites(offerId: string, userId: string): Promise<void>;
}
