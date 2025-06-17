import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ZonesController } from './zones.controller';
import { AlertsGateway } from './alerts.gateway';

@Module({
  imports: [],
  controllers: [AppController, ZonesController],
  providers: [AppService, AlertsGateway],
})
export class AppModule {}
