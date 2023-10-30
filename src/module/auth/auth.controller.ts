import { Body, Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { LocalAuthGuard } from "./guard/local.guard";
import { LoginUserDto } from "../user/dto/login-user.dto";
import { AuthenticationGuard } from "./guard/auth.guard";

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post("register")
  async register(@Body() registerInfo: CreateUserDto) {
    const check = await this.authService.validateRegister(registerInfo.email);
    if (!check) {
      registerInfo.password = await this.authService.hashPassword(registerInfo.password);
      return await this.authService.register(registerInfo);
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Body() loginInfo: LoginUserDto) {
    return await this.authService.login(loginInfo);
  }


  @UseGuards(AuthenticationGuard)
  @Post("logout")
  async getUserLogout(@Res() response): Promise<Response> {
    response.setHeader("Set-Cookie", this.authService.getCookieForLogOut());
    response.clearCookie("access_token");
    response.clearCookie("token");

    return response.sendStatus(200);
  }


}