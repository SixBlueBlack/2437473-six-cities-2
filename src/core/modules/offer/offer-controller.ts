import {inject, injectable} from 'inversify';
import {Controller} from '../../controller/controller.abstract.js';
import {AppComponent} from '../../../types/app-component.enum.js';
import {LoggerInterface} from '../../logger/logger.interface.js';
import {HttpMethod} from '../../../types/http-method.enum.js';
import {OfferServiceInterface} from './offer-service.interface.js';
import {Request, Response} from 'express';
import CreateOfferDto from './dto/create-offer.dto.js';
import {fillDTO} from '../../helpers/common.js';
import OfferRdo from './rdo/offer.rdo.js';
import {StatusCodes} from 'http-status-codes';
import HttpError from '../../errors/http-error.js';
import {UpdateOfferDto} from './dto/update-offer.dto.js';

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.OfferServiceInterface) protected readonly offerService: OfferServiceInterface,
  ) {
    super(logger);
    this.logger.info('Register routes for ConfigController...');

    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.getOfferList});
    this.addRoute({path: '/favourites', method: HttpMethod.Get, handler: this.getFavourites});
    this.addRoute({path: '/:offerId', method: HttpMethod.Put, handler: this.updateOffer});
    this.addRoute({path: '/:offerId', method: HttpMethod.Delete, handler: this.deleteOffer});
    this.addRoute({path: '/:offerId', method: HttpMethod.Get, handler: this.getOfferInfo});
    this.addRoute({path: '/:offerId/addFavourite', method: HttpMethod.Post, handler: this.addFavourite});
    this.addRoute({path: '/:offerId/deleteFavourite', method: HttpMethod.Delete, handler: this.deleteFavourite});
    this.addRoute({path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremium});
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response
  ) {
    const result = await this.offerService.create(body);
    this.created(res, result);
  }

  public async getOfferList({params}: Request<Record<string, unknown>>, res: Response): Promise<void> {
    const limit = params.limit ? parseInt(`${params.limit}`, 10) : undefined;
    const offers = await this.offerService.find(limit);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async getOfferInfo({params}: Request<Record<string, unknown>>, res: Response): Promise<void> {
    const offer = await this.offerService.findOfferById(`${params.offerId}`);
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `No offer with ${params.offerId} id.`,
        'OfferController',
      );
    }

    this.ok(res, offer);
  }

  public async updateOffer(
    {params, body}: Request<Record<string, unknown>, Record<string, unknown>, UpdateOfferDto>,
    res: Response
  ) {
    const offer = await this.offerService.findOfferById(`${params.offerId}`);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `No offer with ${params.offerId} id.`,
        'OfferController',
      );
    }

    const updatedOffer = await this.offerService.updateOfferById(`${params.offerId}`, body);
    this.ok(res, updatedOffer);
  }

  public async deleteOffer(
    {params}: Request<Record<string, unknown>, Record<string, unknown>>,
    res: Response
  ) {
    const offer = await this.offerService.findOfferById(`${params.offerId}`);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `No offer with ${params.offerId} id.`,
        'OfferController',
      );
    }

    await this.offerService.deleteOfferById(`${params.offerId}`);
    this.noContent(res, '');
  }

  public async getPremium(
    {params}: Request<Record<string, unknown>, Record<string, unknown>>,
    res: Response
  ) {
    const offers = await this.offerService.findPremiumOffersByCity(`${params.city}`);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async getFavourites(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, { author: string }>,
    res: Response
  ) {
    const offers = await this.offerService.findFavouriteOffers(`${body.author}`);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async addFavourite(
    {params}: Request<Record<string, unknown>, Record<string, unknown>>,
    res: Response
  ) {
    await this.offerService.addToFavorites(`${params.offerId}`);
    this.ok(res, '');
  }

  public async deleteFavourite(
    {params}: Request<Record<string, unknown>, Record<string, unknown>>,
    res: Response
  ) {
    await this.offerService.deleteFromFavorites(`${params.offerId}`);
    this.ok(res, '');
  }
}
