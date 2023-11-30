import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../schema';
import { AuthenticationGuard } from '../auth/guard/auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/all')
  async getAll() {
    return await this.userService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    return user;
  }

  @UseGuards(AuthenticationGuard)
  @Put('/:id')
  async update(@Param('id') id: string, @Body() user: User) {
    return await this.userService.update(id, user);
  }

  @Get()
  async getUser(@Req() req) {
    return await this.userService.getInfoUser(req);
  }
}
