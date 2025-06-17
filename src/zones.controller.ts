import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('zones')
export class ZonesController {
  @Get()
  async getZones(@Res() res: Response) {
    try {
      const citiesPath = require.resolve('pikud-haoref-api/cities.json');
      const data = fs.readFileSync(citiesPath, 'utf8');
      const cities = JSON.parse(data);
      return res.status(HttpStatus.OK).json(cities);
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Could not load zones' });
    }
  }
} 