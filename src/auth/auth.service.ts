import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthOutput } from './dto/auth.output.dto';
import { LoginAuthInput } from './dto/auth.input.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { RequestContext } from './types/auth.type';
import { randomBytes, scrypt as scryptCallback } from 'crypto';
import { promisify } from 'util';
import { SafeUser } from '../shared/types/types';

const scrypt = promisify(scryptCallback);

@Injectable()
export class AuthService {
  private readonly scryptKeyLength = 32;

  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async login(loginDto: LoginAuthInput): Promise<LoginAuthOutput> {
    const { username, password } = loginDto;

    const retrievedUser = await this.userRepo.findOneBy({
      username,
      // passwordHash: await this.hashPassword(password),
    });

    if (!retrievedUser) throw new NotFoundException();

    // if ((await this.hashPassword(password)) !== retrievedUser.passwordHash)
    //   throw new UnauthorizedException();
    this.verifyPassword(password, retrievedUser.passwordHash);

    const payload: RequestContext = {
      sub: retrievedUser.id,
      username: retrievedUser.username,
      userId: retrievedUser.id,
      // roles: retrievedUser.role,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async getUser(userId: string): Promise<User> {
    const user = await this.userRepo.findOneByOrFail({ id: userId });
    return this.toSafeUser(user) as User;
  }

  private async verifyPassword(
    plain: string,
    stored: string,
  ): Promise<boolean> {
    const [salt, hash] = stored.split(':');
    const derived = (await scrypt(plain, salt, this.scryptKeyLength)) as Buffer;
    return hash === derived.toString('hex');
  }

  private toSafeUser(user: User): SafeUser {
    const { passwordHash, ...safe } = user;
    return safe;
  }
}
