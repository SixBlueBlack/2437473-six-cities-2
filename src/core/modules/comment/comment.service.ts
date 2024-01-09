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

    const rating = await this.commentModel
      .find({offerId: dto.offerId}).select('rating').exec();

    let total = 0;
    for (const element of rating) {
      total += element.rating;
    }

    const offer = await this.offerService.findOfferById(dto.offerId);

    const count = offer?.commentsNumber ?? 1;
    const newRating = total / (count);
    await this.offerService.updateRating(dto.offerId, newRating);
    return comment.populate('author');
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({offerId})
      .populate('author');
  }
}
