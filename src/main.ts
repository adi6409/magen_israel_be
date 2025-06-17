import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

class CustomIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any) {
    options = options || {};
    options.path = '/api/ws';
    return super.createIOServer(port, options);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new CustomIoAdapter(app));
  // add /api prefix
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3939);
}
bootstrap();
