import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
const pikudHaoref = require('pikud-haoref-api');

@WebSocketGateway({ cors: true })
@Injectable()
export class AlertsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private lastAlert: any = null;
  private readonly logger = new Logger('AlertsGateway');
  private pollInterval: NodeJS.Timeout;

  afterInit() {
    this.logger.log('WebSocket Gateway Initialized');
    this.startPolling();
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    if (this.lastAlert) {
      client.emit('alert', this.lastAlert);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  private startPolling() {
    const poll = () => {
      pikudHaoref.getActiveAlert((err: any, alert: any) => {
        if (err) {
          this.logger.error('Error polling alert:', err);
          return;
        }
        if (JSON.stringify(alert) !== JSON.stringify(this.lastAlert)) {
          this.lastAlert = alert;
          this.server.emit('alert', alert);
          this.logger.log('Broadcasted new alert');
        }
      });
    };
    poll();
    this.pollInterval = setInterval(poll, 5000);
  }
} 