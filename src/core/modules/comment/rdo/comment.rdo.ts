import {Expose, Type} from 'class-transformer';
import UserRdo from '../../user/rdo/user.rdo.js';

export default class CommentRdo {
  @Expose()
  public id!: string;

  @Expose()
  public text!: string;

  @Expose()
  public postDate!: Date;

  @Expose()
  public rating!: number;

  @Expose({name: 'author'})
  @Type(() => UserRdo)
  public author!: UserRdo;
}
