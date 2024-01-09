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
import {ValidateObjectIdMiddleware} from '../../middleware/validate-objectId.middleware.js';
import {ValidateDtoMiddleware} from '../../middleware/validate-dto.middleware.js';
import {DocumentExistsMiddleware} from '../../middleware/document-exists.middleware.js';
import {PrivateRouteMiddleware} from '../../middleware/private-route.middleware.js';
import {ConfigInterface} from '../../config/config.interface.js';
import {RestSchema} from '../../config/rest.schema.js';

@injectable()
export default class CommentController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.CommentServiceInterface) protected readonly commentService: CommentServiceInterface,
    @inject(AppComponent.OfferServiceInterface) protected readonly offerService: OfferServiceInterface,
    @inject(AppComponent.ConfigInterface) protected readonly configService: ConfigInterface<RestSchema>
  ) {
    super(logger, configService);

    this.logger.info('Register routes for CommentController...');

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
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
    {body, res}: Request<UnknownRecord, UnknownRecord, CreateCommentDto>,
    _res: Response
  ) {
    const comment = await this.commentService.create({...body, author: res?.locals.author.id});
    this.created(_res, fillDTO(CommentRdo, comment));
  }

  public async getComments(
    {params}: Request<ParamsOfferId>,
    res: Response
  ) {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }
}
