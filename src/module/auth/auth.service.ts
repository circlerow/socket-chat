import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcryptjs from 'bcryptjs';
import { CreateUserDto } from '../../share/dto/create-user.dto';
import { LoginUserDto } from '../../share/dto/login-user.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateRegister(email: string) {
    const user = await this.userService.getByEmail(email);
    if (user) {
      throw new HttpException('Email is exist', HttpStatus.FORBIDDEN);
    }
    return user;
  }

  async register(register: CreateUserDto) {
    const id = nanoid(8);
    const user = {
      id,
      ...register,
    };
    return await this.userService.create(user);
  }

  async authentication(email: string, password: string): Promise<any> {
    const user = await this.userService.getByEmail(email);
    if (!user) {
      return false;
    }
    const check = await this.comparePassword(password, user.password);

    if (!user || !check) {
      return false;
    }

    return user;
  }

  async comparePassword(
    password: string,
    storePasswordHash: string,
  ): Promise<any> {
    return await bcryptjs.compare(password, storePasswordHash);
  }

  async hashPassword(password: string): Promise<string> {
    return await bcryptjs.hash(password, 12);
  }

  async login(loginUser: LoginUserDto) {
    const user = await this.userService.getByEmail(loginUser.email);
    if (!user) {
      throw new HttpException('Email is not exist', HttpStatus.FORBIDDEN);
    }
    const check = await this.comparePassword(loginUser.password, user.password);
    if (!check) {
      throw new HttpException('Password is not correct', HttpStatus.FORBIDDEN);
    }
    const payload = { email: user.email, sub: user.name };
    return {
      access_token: this.jwtService.sign(payload),
      userId: user.id,
    };
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
