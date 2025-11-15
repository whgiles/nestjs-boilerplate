import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request, Response, response } from 'express';
import {
  QueryFailedError,
  EntityNotFoundError,
  CannotCreateEntityIdMapError,
} from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(protected readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const request = ctx.getRequest<Request>();
    const error = (exception as any).message.message;
    const code = 'HttpException';

    Logger.error(
      error,
      (exception as any).stack,
      `${request.method} ${request.url}`,
      `--------------------------------------------------
      body: ${JSON.stringify(request.headers, null, 2)}
      headers: ${JSON.stringify(request.body, null, 2)}
      ------------------------------------------------------`,
    );

    const responseBody =
      exception instanceof HttpException
        ? {
            statusCode: exception.getStatus(),
            response: exception.getResponse(),
            message: exception.message,
            name: exception.name,
          }
        : {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            response: null,
            message: exception,
            name: InternalServerErrorException.name,
          };
    httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode);
  }
}

export const GlobalResponseError: (
  statusCode: number,
  message: string,
  code: string,
  request: Request,
) => IResponseError = (
  statusCode: number,
  message: string,
  code: string,
  request: Request,
): IResponseError => {
  return {
    statusCode: statusCode,
    message,
    code,
    timestamp: new Date().toISOString(),
    path: request.url,
    method: request.method,
  };
};

export interface IResponseError {
  statusCode: number;
  message: string;
  code: string;
  timestamp: string;
  path: string;
  method: string;
}
