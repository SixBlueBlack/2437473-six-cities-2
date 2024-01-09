import {inject, injectable} from 'inversify';
import {Controller} from '../../controller/controller.abstract.js';
import {AppComponent} from '../../../types/app-component.enum.js';
import {LoggerInterface} from '../../logger/logger.interface.js';
import {HttpMethod} from '../../../types/http-method.enum.js';
import {Request, Response} from 'express';
import CreateUserDto from './dto/create-user.dto.js';
import {UserServiceInterface} from './user-service.interface.js';
import {ConfigInterface} from '../../config/config.interface.js';
import HttpError from '../../errors/http-error.js';
import {StatusCodes} from 'http-status-codes';
import {createJWT, fillDTO} from '../../helpers/common.js';
import UserRdo from './rdo/user.rdo.js';
import {RestSchema} from '../../config/rest.schema.js';
import LoginUserDto from './dto/login-user.dto.js';
import {ValidateDtoMiddleware} from '../../middleware/validate-dto.middleware.js';
import {ValidateObjectIdMiddleware} from '../../middleware/validate-objectId.middleware.js';
import {UploadFileMiddleware} from '../../middleware/upload-file.middleware.js';
import {JWT_ALGORITHM} from './user.constant.js';
import LoggedUserRdo from './rdo/logged-user.rdo.js';
import {PrivateRouteMiddleware} from '../../middleware/private-route.middleware.js';
import UploadUserAvatarResponse from './rdo/upload-user-avatar.response.js';

@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.UserServiceInterface) protected readonly userService: UserServiceInterface,
    @inject(AppComponent.ConfigInterface) protected readonly configService: ConfigInterface<RestSchema>,
  ) {
    super(logger, configService);
    this.logger.info('Register routes for UserController...');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)]
    });

    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });

    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.getUserInfo,
      middlewares: [new PrivateRouteMiddleware()]
    });

    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar')]
    });
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
    res: Response
  ) {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email ${body.email} exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(
      res,
      fillDTO(UserRdo, result),
    );
  }

  public async login(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
    res: Response,
  ): Promise<void> {
    const user = await this.userService.verifyUser(body, this.configService.get('SALT'));

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'UNAUTHORIZED',
        'UserController',
      );
    }

    const token = await createJWT(
      JWT_ALGORITHM,
      this.configService.get('JWT_SECRET'),
      {
        email: user.email,
        id: user.id
      }
    );

    this.ok(res, {...fillDTO(LoggedUserRdo, user), token});
  }

  public async getUserInfo({res}: Request, _res: Response): Promise<void> {
    const foundedUser = await this.userService.findByEmail(res?.locals.author.email);

    if (!res || !foundedUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'UNAUTHORIZED',
        'UserController'
      );
    }

    this.ok(res, fillDTO(UserRdo, foundedUser));
  }

  public async uploadAvatar(req: Request, res: Response) {
    const {userId} = req.params;
    const uploadFile = {avatar: req.file?.filename};
    await this.userService.updateById(userId, uploadFile);
    this.created(res, fillDTO(UploadUserAvatarResponse, uploadFile));
  }
}
