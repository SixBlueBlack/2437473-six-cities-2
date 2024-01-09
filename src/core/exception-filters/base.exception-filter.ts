import {inject, injectable} from 'inversify';
import {ExceptionFilterInterface} from './exception-filter.interface.js';
import {AppComponent} from '../../types/app-component.enum.js';
import {NextFunction, Request, Response} from 'express';
import {LoggerInterface} from '../logger/logger.interface.js';
import {StatusCodes} from 'http-status-codes';
import {createErrorObject} from '../helpers/common.js';
import {ServiceError} from '../../types/service-error.enum.js';

@injectable()
export default class BaseExceptionFilter implements ExceptionFilterInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface
  ) {
    this.logger.info('Register BaseExceptionFilter');
  }

  public catch(error: Error, _req: Request, res: Response, _next: NextFunction) {
    this.logger.error(`[BaseException]: ${error.message}`);

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject(ServiceError.ServiceError, error.message));
  }
}
