import {DocumentType} from '@typegoose/typegoose';
import {OfferEntity} from './offer.entity.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import {UpdateOfferDto} from './dto/update-offer.dto.js';

export interface OfferServiceInterface {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;

  findOfferById(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  deleteOfferById(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  updateOfferById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;

  find(count: number): Promise<DocumentType<OfferEntity>[]>;

  findPremiumOffersByCity(city: string): Promise<DocumentType<OfferEntity>[]>;

  findFavouriteOffers(): Promise<DocumentType<OfferEntity>[]>;

  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  exists(documentId: string): Promise<boolean>;

  updateRating(offerId: string, newRating: number): Promise<void>;
}
