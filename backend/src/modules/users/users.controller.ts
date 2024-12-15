import { Controller, Get, Param, Post, Body, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDataDto } from './users.models';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   *
   * Tüm kullanıcıları getiren endpoint
   */
  @Get()
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('search') search: string = '',
  ) {
    return await this.usersService.getAllUsers({ page, pageSize, search });
  }

  /**
   *
   * Id değerine göre kullanıcıyı getiren endpoint
   */
  @Get(':id')
  async getUserById(@Param('id') id: number) {
    return await this.usersService.getUserById(id);
  }

  /**
   *
   * Yeni kullanıcıyı kaydeden endpoint
   */
  @Post('save')
  async saveUser(@Body() createUserDto: UserDataDto) {
    return await this.usersService.saveUser(createUserDto);
  }

  /**
   *
   * Kullanıcı bilgilerini güncelleyen endpoint
   */
  @Post('update')
  async updateUser(@Body() updateUserDto: UserDataDto) {
    return await this.usersService.updateUser(updateUserDto);
  }

  /**
   *
   * Kullanıcıyı silen endpoint
   */
  @Delete('delete')
  async deleteUser(@Body() body: { id: number }) {
    return this.usersService.deleteUser(body.id);
  }
}
