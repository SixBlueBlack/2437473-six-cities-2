import {User} from '../../../types/user.type.js';
import typegoose, {defaultClasses, getModelForClass, modelOptions} from '@typegoose/typegoose';
import {createSHA256} from '../../helpers/common.js';
import {UserType} from '../../../types/user-type.enum.js';

const {prop} = typegoose;

export interface UserEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({required: true})
  public name!: string;

  @prop({unique: true, required: true})
  public email!: string;

  @prop({required: false, default: ''})
  public avatar!: string;

  @prop({required: true})
  private password?: string;

  @prop({required: true})
  public type!: UserType;

  constructor(userData: User) {
    super();

    this.name = userData.name;
    this.email = userData.email;
    this.avatar = userData.avatar;
    this.type = userData.type;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
