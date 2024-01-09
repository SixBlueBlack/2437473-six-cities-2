import {NextFunction, Request, Response} from 'express';
import {MiddlewareInterface} from './middleware.interface.js';
import HttpError from '../errors/http-error.js';
import {StatusCodes} from 'http-status-codes';

export class PrivateRouteMiddleware implements MiddlewareInterface {
  public async execute({res}: Request, _res: Response, next: NextFunction): Promise<void> {
    if (res === undefined || !res.locals.author) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'PrivateRouteMiddleware'
      );
    }

    return next();
  }
}
