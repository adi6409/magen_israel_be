import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { AlertStoreService } from './alert-store.service';
const pikudHaoref = require('pikud-haoref-api');

@WebSocketGateway({ cors: true })
@Injectable()
export class AlertsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private lastAlert: any = null;
  private readonly logger = new Logger('AlertsGateway');
  private pollInterval: NodeJS.Timeout;

  constructor(private readonly alertStore: AlertStoreService) {}

  afterInit() {
    this.logger.log('WebSocket Gateway Initialized');
    this.startPolling();
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    // Send all latest alerts for all zones
    const allAlerts = await this.alertStore.getAllLatestAlerts();
    client.emit('all-latest-alerts', allAlerts);
    if (this.lastAlert) {
      client.emit('alert', this.lastAlert);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  private startPolling() {
    const poll = async () => {
      pikudHaoref.getActiveAlert(async (err: any, alert: any) => {
        if (err) {
          this.logger.error('Error polling alert:', err);
          return;
        }
        if (JSON.stringify(alert) !== JSON.stringify(this.lastAlert)) {
          this.lastAlert = alert;
          // Persist latest alert for each zone
          if (alert && Array.isArray(alert.cities)) {
            await Promise.all(alert.cities.map((zone: string) =>
              this.alertStore.setLatestAlertForZone(zone, alert)
            ));
          }
          this.server.emit('alert', alert);
          this.logger.log('Broadcasted new alert and updated Redis');
        }
      });
    };
    poll();
    this.pollInterval = setInterval(poll, 2000);
  }
} 