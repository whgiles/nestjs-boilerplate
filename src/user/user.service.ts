import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateUserInput,
  LoginUserInput,
  UpdateUserInput,
} from './dto/input.user.dto';
import { EntityNotFoundException, SafeUser } from '../shared/types/types';
import { randomBytes, scrypt as scryptCallback } from 'crypto';
import { promisify } from 'util';
import { FindOneUserOutput, UpdateUserOutput } from './dto/output.user.dto';

const scrypt = promisify(scryptCallback);

@Injectable()
export class UserService {
  private readonly scryptKeyLength = 32;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserInput): Promise<SafeUser> {
    const username = this.normalizeUsername(createUserDto.username);
    const password = createUserDto.password?.trim();

    if (!username) {
      throw new BadRequestException('username is required');
    }

    if (!password || password.length < 8) {
      throw new BadRequestException(
        'password is required and must be at least 8 characters',
      );
    }

    await this.ensureUsernameAvailable(username);

    const passwordHash = await this.hashPassword(password);
    const user = this.usersRepository.create({
      username,
      passwordHash,
      email: createUserDto.email,
    });

    const saved = await this.usersRepository.save(user);
    return this.toSafeUser(saved);
  }

  async findOne(id: string): Promise<FindOneUserOutput> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new EntityNotFoundException(User.name, id);
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserInput,
  ): Promise<UpdateUserOutput> {
    await this.usersRepository.update(id, updateUserDto);
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new EntityNotFoundException(User.name, id);
    }

    return this.toSafeUser(user);
  }

  async delete(id: string): Promise<void> {
    await this.usersRepository.softDelete({ id });
  }

  async findUserByCredentials(
    loginDto: LoginUserInput,
  ): Promise<FindOneUserOutput> {
    const { username, password } = loginDto;
    const user = await this.usersRepository.findOneBy({ username });

    if (!user) {
      throw new EntityNotFoundException(User.name, username);
    }

    if ((await this.hashPassword(password)) !== user.passwordHash)
      throw new UnauthorizedException();

    return this.toSafeUser(user);
  }

  private normalizeUsername(username?: string): string | null {
    if (!username) {
      return null;
    }

    const trimmed = username.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  private async ensureUsernameAvailable(username: string): Promise<void> {
    const existing = await this.usersRepository.findOne({
      where: { username },
      select: ['id'],
    });

    if (existing) {
      throw new ConflictException('username is already taken');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scrypt(
      password,
      salt,
      this.scryptKeyLength,
    )) as Buffer;
    return `${salt}:${derivedKey.toString('hex')}`;
  }

  private toSafeUser(user: User): SafeUser {
    const { passwordHash, ...safe } = user;
    return safe;
  }
}
