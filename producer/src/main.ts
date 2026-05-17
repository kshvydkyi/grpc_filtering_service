import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { GrpcOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums';
import { existsSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const configContext = await NestFactory.createApplicationContext(
    ConfigModule.forRoot({ isGlobal: true }),
  );
  const configService = configContext.get(ConfigService);
  const grpcUrl = configService.get<string>('GRPC_URL', '0.0.0.0:50051');
  await configContext.close();

  const protoPath = [
    join(process.cwd(), 'proto/users.proto'),
    join(process.cwd(), '../proto/users.proto'),
  ].find((path) => existsSync(path))!;

  const grpcOptions: GrpcOptions = {
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath,
      url: grpcUrl,
    },
  };

  const app = await NestFactory.createMicroservice(AppModule, grpcOptions);
  await app.listen();
}

void bootstrap();
