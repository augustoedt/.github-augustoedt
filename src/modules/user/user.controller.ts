import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { UserService } from '../user/user.service';
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // User Create and Delete for testing comment creation
  @Post('user/create')
  async createUser(
    @Body() postData: { email: string; name: string },
  ): Promise<UserModel> {
    return this.userService.createUser(postData);
  }

  @Delete('user/:userid')
  async deleteUser(@Param('userid') id: string): Promise<UserModel> {
    return this.userService.deleteUser({ where: { id } });
  }
}
