import { Controller, Get, Req, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {

  @UseGuards(AuthGuard("jwt"))
  @Get("me")
  getMe(@Req() req: Request) {
    return req;
  }


}
