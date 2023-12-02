import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/all')
  async getAll(@Req() req) {
    return await this.userService.getAll(req);
  }

  @Get()
  async getUser(@Req() req) {
    return await this.userService.getInfoUser(req);
  }
}
