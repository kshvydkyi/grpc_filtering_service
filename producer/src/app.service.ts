import { status } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { existsSync } from 'fs';
import { promises as fs } from 'fs';
import { join } from 'path';
import { User } from './interfaces/user.interface';

@Injectable()
export class AppService {
  private readonly usersFilePath = [
    join(process.cwd(), 'src', 'data', 'users.json'),
    join(process.cwd(), 'dist', 'data', 'users.json'),
  ].find((path) => existsSync(path))!;

  async getFilteredUsers(): Promise<User[]> {
    try {
      const raw = await fs.readFile(this.usersFilePath, 'utf-8');
      const users = JSON.parse(raw) as User[];
      return users.filter((user) => user.age > 18);
    } catch {
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Failed to load or parse users data',
      });
    }
  }
}
