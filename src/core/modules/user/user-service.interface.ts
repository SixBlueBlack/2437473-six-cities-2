import CreateUserDto from './dto/create-user.dto.js';
import {DocumentType} from '@typegoose/typegoose';
import {UserEntity} from './user.entity.js';
import {OfferEntity} from '../offer/offer.entity.js';

export interface UserServiceInterface {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;

  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;

  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;

  addToFavorites(userId: string, offerId: string): Promise<DocumentType<OfferEntity>[] | null>;

  deleteFromFavorites(userId: string, offerId: string): Promise<DocumentType<OfferEntity>[] | null>;

  findById(userId: string): Promise<DocumentType<UserEntity> | null>;
}
