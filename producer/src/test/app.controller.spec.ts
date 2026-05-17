import { Test, TestingModule } from '@nestjs/testing';
import { RpcException } from '@nestjs/microservices';
import { promises as fs } from 'fs';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getFilteredUsers', () => {
    it('should return only users older than 18', async () => {
      const result = await appController.getFilteredUsers();
      expect(result.users.every((user) => user.age > 18)).toBe(true);
      expect(result.users.length).toBeGreaterThan(0);
    });

    it('should throw RpcException on file read error', async () => {
      const readFileSpy = jest
        .spyOn(fs, 'readFile')
        .mockRejectedValue(new Error('read failed'));

      await expect(appController.getFilteredUsers()).rejects.toThrow(
        RpcException,
      );

      readFileSpy.mockRestore();
    });
  });
});
