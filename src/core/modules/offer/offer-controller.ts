import {inject, injectable} from 'inversify';
import {Controller} from '../../controller/controller.abstract.js';
import {AppComponent} from '../../../types/app-component.enum.js';
import {LoggerInterface} from '../../logger/logger.interface.js';
import {HttpMethod} from '../../../types/http-method.enum.js';
import {OfferServiceInterface} from './offer-service.interface.js';
import {Request, Response} from 'express';
import CreateOfferDto from './dto/create-offer.dto.js';
import {fillDTO} from '../../helpers/common.js';
import IndexOfferRdo from './rdo/index-offer.rdo.js';
import {StatusCodes} from 'http-status-codes';
import HttpError from '../../errors/http-error.js';
import {UpdateOfferDto} from './dto/update-offer.dto.js';
import OfferRdo from './rdo/offer.rdo.js';
import {UnknownRecord} from '../../../types/unknown-record.type.js';
import {ParamsOfferCity, ParamsOfferLimit, ParamsOfferId} from '../../../types/params-offer.types.js';
import {ValidateObjectIdMiddleware} from '../../middleware/validate-objectId.middleware.js';
import {ValidateDtoMiddleware} from '../../middleware/validate-dto.middleware.js';

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.OfferServiceInterface) protected readonly offerService: OfferServiceInterface,
  ) {
    super(logger);
    this.logger.info('Register routes for ConfigController...');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateOfferDto)]
    });

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.getOfferList});
    this.addRoute({path: '/favourites', method: HttpMethod.Get, handler: this.getFavourites});

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Put,
      handler: this.updateOffer,
      middlewares: [new ValidateObjectIdMiddleware('offerId'), new ValidateDtoMiddleware(UpdateOfferDto)]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteOffer,
      middlewares: [new ValidateObjectIdMiddleware('offerId')]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.getOfferInfo,
      middlewares: [new ValidateObjectIdMiddleware('offerId')]
    });

    this.addRoute({
      path: '/:offerId/addFavourite',
      method: HttpMethod.Post,
      handler: this.addFavourite,
      middlewares: [new ValidateObjectIdMiddleware('offerId')]
    });

    this.addRoute({
      path: '/:offerId/deleteFavourite',
      method: HttpMethod.Delete,
      handler: this.deleteFavourite,
      middlewares: [new ValidateObjectIdMiddleware('offerId')]
    });

    this.addRoute({path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremium});
  }

  public async create(
    {body}: Request<UnknownRecord, UnknownRecord, CreateOfferDto>,
    res: Response
  ) {
    const result = await this.offerService.create(body);
    this.created(res, result);
  }

  public async getOfferList({params}: Request<ParamsOfferLimit>, res: Response): Promise<void> {
    const limit = params.limit ? parseInt(`${params.limit}`, 10) : undefined;
    const offers = await this.offerService.find(limit);
    this.ok(res, fillDTO(IndexOfferRdo, offers));
  }

  public async getOfferInfo({params}: Request<ParamsOfferId>, res: Response): Promise<void> {
    const offer = await this.offerService.findOfferById(params.offerId);
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `No offer with ${params.offerId} id.`,
        'OfferController',
      );
    }

    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async updateOffer(
    {params, body}: Request<ParamsOfferId, UnknownRecord, UpdateOfferDto>,
    res: Response
  ) {
    const offer = await this.offerService.findOfferById(params.offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `No offer with ${params.offerId} id.`,
        'OfferController',
      );
    }

    const updatedOffer = await this.offerService.updateOfferById(params.offerId, body);
    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async deleteOffer(
    {params}: Request<ParamsOfferId>,
    res: Response
  ) {
    const offer = await this.offerService.findOfferById(params.offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `No offer with ${params.offerId} id.`,
        'OfferController',
      );
    }

    await this.offerService.deleteOfferById(params.offerId);
    this.noContent(res, 'Offer was deleted');
  }

  public async getPremium(
    {params}: Request<ParamsOfferCity>,
    res: Response
  ) {
    const offers = await this.offerService.findPremiumOffersByCity(params.city);
    this.ok(res, fillDTO(IndexOfferRdo, offers));
  }

  public async getFavourites(
    {body}: Request<UnknownRecord, UnknownRecord, { author: string }>,
    res: Response
  ) {
    const offers = await this.offerService.findFavouriteOffers(body.author);
    this.ok(res, fillDTO(IndexOfferRdo, offers));
  }

  public async addFavourite(
    {params}: Request<ParamsOfferId>,
    res: Response
  ) {
    await this.offerService.addToFavorites(params.offerId);
    this.ok(res, 'Offer was added to favourites');
  }

  public async deleteFavourite(
    {params}: Request<ParamsOfferId>,
    res: Response
  ) {
    await this.offerService.deleteFromFavorites(params.offerId);
    this.ok(res, 'Offer was deleted from favourites');
  }
}
