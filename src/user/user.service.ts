import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateUserInputDto,
  LoginUserInputDto,
  UpdateUserInputDto,
} from './dto/input.user.dto';
import {
  CreateUserOutputDto,
  FindOneUserOutputDto,
  UpdateUserOutputDto,
} from './dto/output.user.dto';
import { EntityNotFoundException } from 'src/shared/types/types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(
    createUserDto: CreateUserInputDto,
  ): Promise<CreateUserOutputDto> {
    const entity = this.userRepo.create({ ...createUserDto });

    try {
      await this.userRepo.save(entity);
    } catch (e) {
      throw new HttpException(
        'Could not create user. username or email may already be in use',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userRepo.findOneBy({
      username: createUserDto.username,
    });
    delete user.password;
    return user;
  }

  async findOne(id: string): Promise<FindOneUserOutputDto> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new EntityNotFoundException(User.name, id);
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserInputDto,
  ): Promise<UpdateUserOutputDto> {
    await this.userRepo.update(id, updateUserDto);
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new EntityNotFoundException(User.name, id);
    }

    delete user.password;
    return user;
  }

  async delete(id: string): Promise<void> {
    await this.userRepo.softDelete({ id });
  }

  async findUserByCredentials(
    loginDto: LoginUserInputDto,
  ): Promise<FindOneUserOutputDto> {
    const { username, password } = loginDto;
    const user = await this.userRepo.findOneBy({ username, password });

    if (!user) {
      throw new EntityNotFoundException(User.name, username);
    }
    delete user.password;
    return user;
  }
}
