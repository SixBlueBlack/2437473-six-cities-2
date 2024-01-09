import {inject, injectable} from 'inversify';
import {Controller} from '../../controller/controller.abstract.js';
import {AppComponent} from '../../../types/app-component.enum.js';
import {LoggerInterface} from '../../logger/logger.interface.js';
import {OfferServiceInterface} from '../offer/offer-service.interface.js';
import {CommentServiceInterface} from './comment-service.interface.js';
import {HttpMethod} from '../../../types/http-method.enum.js';
import {Request, Response} from 'express';
import {ParamsOfferId} from '../../../types/params-offer.types.js';
import {UnknownRecord} from '../../../types/unknown-record.type.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import {fillDTO} from '../../helpers/common.js';
import CommentRdo from './rdo/comment.rdo.js';
import HttpError from '../../errors/http-error.js';
import {StatusCodes} from 'http-status-codes';
import {ValidateObjectIdMiddleware} from '../../middleware/validate-objectId.middleware.js';
import {ValidateDtoMiddleware} from '../../middleware/validate-dto.middleware.js';
import {DocumentExistsMiddleware} from '../../middleware/document-exists.middleware.js';

@injectable()
export default class CommentController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.CommentServiceInterface) protected readonly commentService: CommentServiceInterface,
    @inject(AppComponent.OfferServiceInterface) protected readonly offerService: OfferServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController...');

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(CreateCommentDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
  }

  public async create(
    {body}: Request<UnknownRecord, UnknownRecord, CreateCommentDto>,
    res: Response
  ) {
    if (!await this.offerService.exists(body.offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Not found offer with ${body.offerId} id`,
        'CommentController'
      );
    }

    const comment = await this.commentService.create(body);
    this.created(res, fillDTO(CommentRdo, comment));
  }

  public async getComments(
    {params}: Request<ParamsOfferId>,
    res: Response
  ) {
    if (!await this.offerService.exists(params.offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Not found offer with ${params.offerId} id`,
        'CommentController'
      );
    }

    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }
}
