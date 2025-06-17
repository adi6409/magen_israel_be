import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class AlertStoreService implements OnModuleInit {
  private readonly redis: Redis;
  private readonly logger = new Logger('AlertStoreService');
  private readonly prefix = 'alert:zone:';

  constructor() {
    this.redis = new Redis(); // Defaults to localhost:6379
  }

  async onModuleInit() {
    this.logger.log('AlertStoreService initialized');
  }

  async setLatestAlertForZone(zone: string, alert: any): Promise<void> {
    await this.redis.set(this.prefix + zone, JSON.stringify(alert));
  }

  async getLatestAlertForZone(zone: string): Promise<any | null> {
    const data = await this.redis.get(this.prefix + zone);
    return data ? JSON.parse(data) : null;
  }

  async getAllLatestAlerts(): Promise<Record<string, any>> {
    const keys = await this.redis.keys(this.prefix + '*');
    const result: Record<string, any> = {};
    if (keys.length === 0) return result;
    const values = await this.redis.mget(...keys);
    keys.forEach((key: string, i: number) => {
      const zone = key.replace(this.prefix, '');
      try {
        result[zone] = values[i] ? JSON.parse(values[i]!) : null;
      } catch {
        result[zone] = null;
      }
    });
    return result;
  }
} 