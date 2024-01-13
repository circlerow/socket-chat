import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticationGuard } from './guard/auth.guard';
import { CreateUserDto } from '../../share/dto/create-user.dto';
import { LoginUserDto } from '../../share/dto/login-user.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerInfo: CreateUserDto) {
    const check = await this.authService.validateRegister(registerInfo.email);
    if (!check) {
      registerInfo.password = await this.authService.hashPassword(
        registerInfo.password,
      );
      return await this.authService.register(registerInfo);
    }
  }

  @Post('login')
  async login(@Body() loginInfo: LoginUserDto) {
    return await this.authService.login(loginInfo);
  }

  @UseGuards(AuthenticationGuard)
  @Post('logout')
  async getUserLogout(@Res() response): Promise<Response> {
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    response.clearCookie('access_token');
    response.clearCookie('token');

    return response.sendStatus(200);
  }
}
