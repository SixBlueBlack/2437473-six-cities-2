import {inject, injectable} from 'inversify';
import {AppComponent} from '../../../types/app-component.enum.js';
import {CommentServiceInterface} from './comment-service.interface.js';
import {CommentEntity} from './comment.entity.js';
import {OfferServiceInterface} from '../offer/offer-service.interface.js';
import {DocumentType, types} from '@typegoose/typegoose';
import CreateCommentDto from './dto/create-comment.dto.js';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(AppComponent.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(AppComponent.OfferServiceInterface) private readonly offerService: OfferServiceInterface
  ) {
  }

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    await this.offerService.incCommentCount(dto.offerId);

    const offer = await this.offerService.findOfferById(dto.offerId);
    const newRating = (offer!.rating + dto.rating) / offer!.commentsNumber;

    await this.offerService.updateRating(dto.offerId, newRating);
    return comment.populate('user');
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({offerId})
      .populate('user');
  }
}
