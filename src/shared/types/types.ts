import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  createParamDecorator,
} from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';
import { RequestContextEnum } from '../../auth/types/auth.type';
import { User } from 'src/entities/user.entity';

export enum Month {
  JANUARY = 'JANUARY',
  FEBRUARY = 'FEBRUARY',
  MARCH = 'MARCH',
  APRIL = 'APRIL',
  MAY = 'MAY',
  JUNE = 'JUNE',
  JULY = 'JULY',
  AUGUST = 'AUGUST',
  SEPTEMBER = 'SEPTEMBER',
  OCTOBER = 'OCTOBER',
  NOVEMBER = 'NOVEMBER',
  DECEMBER = 'DECEMBER',
}

export enum BankingAccountType {
  CREDIT = 'CREDIT',
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
}

export class EntityNotFoundException extends HttpException {
  constructor(entity: string, id: any) {
    super(`${entity} with ID ${id} not found`, HttpStatus.NOT_FOUND);
    this.name = 'EntityNotFoundException';
  }
}

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const AppContext = createParamDecorator(
  (arg: RequestContextEnum, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const requestContext = request.context;

    return arg ? requestContext?.[arg] : requestContext;
  },
);

export type SafeUser = Omit<User, 'passwordHash'>;
