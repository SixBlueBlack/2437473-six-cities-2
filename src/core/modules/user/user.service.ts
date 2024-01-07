import {UserServiceInterface} from './user-service.interface.js';
import CreateUserDto from './dto/create-user.dto.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {UserEntity} from './user.entity.js';
import {inject, injectable} from 'inversify';
import {AppComponent} from '../../../types/app-component.enum.js';
import {LoggerInterface} from '../../logger/logger.interface.js';
import {OfferEntity} from '../offer/offer.entity.js';

@injectable()
export default class UserService implements UserServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {
  }

  findById(userId: string): Promise<DocumentType<UserEntity, types.BeAnObject> | null> {
    return this.userModel
      .findById(userId)
      .exec();
  }

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);
    if (existedUser) {
      return existedUser;
    }
    return this.create(dto, salt);
  }

  public async addToFavorites(userId: string, offerId: string): Promise<DocumentType<OfferEntity, types.BeAnObject>[] | null> {
    return this.userModel.findByIdAndUpdate(userId, {$push: {favorite: offerId}, new: true});
  }

  public async deleteFromFavorites(userId: string, offerId: string): Promise<DocumentType<OfferEntity, types.BeAnObject>[] | null> {
    return this.userModel.findByIdAndUpdate(userId, {$pull: {favorite: offerId}, new: true});
  }
}
