import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AppService } from './app.service';
import { UserList } from './interfaces/user.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod('UserService', 'GetFilteredUsers')
  async getFilteredUsers(): Promise<UserList> {
    const users = await this.appService.getFilteredUsers();
    return { users };
  }
}
