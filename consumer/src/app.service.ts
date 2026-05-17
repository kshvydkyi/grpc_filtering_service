import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';
import { UserList } from './interfaces/user.interface';

interface UserServiceClient {
  getFilteredUsers(request: Record<string, never>): Observable<UserList>;
}

@Injectable()
export class AppService implements OnModuleInit {
  constructor(@Inject('USER_SERVICE') private readonly client: ClientGrpc) {}

  async onModuleInit(): Promise<void> {
    const userService =
      this.client.getService<UserServiceClient>('UserService');
    const response = await lastValueFrom(userService.getFilteredUsers({}));
    console.log('Filtered Users:\n', JSON.stringify(response.users, null, 2));
  }
}
