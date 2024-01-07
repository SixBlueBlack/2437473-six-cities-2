import {Container} from 'inversify';
import {CommentServiceInterface} from './comment-service.interface.js';
import {AppComponent} from '../../../types/app-component.enum.js';
import CommentService from './comment.service.js';
import {types} from '@typegoose/typegoose';
import {CommentEntity, CommentModel} from './comment.entity.js';


export function createCommentContainer() {
  const commentContainer = new Container();

  commentContainer.bind<CommentServiceInterface>(AppComponent.CommentServiceInterface)
    .to(CommentService)
    .inSingletonScope();

  commentContainer.bind<types.ModelType<CommentEntity>>(AppComponent.CommentModel).toConstantValue(CommentModel);

  return commentContainer;
}
