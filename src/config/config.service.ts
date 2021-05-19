import { Inject, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { EnvConfig } from './interfaces/envconfig.interface';
import { CONFIG_OPTIONS } from './constants';
import { ConfigOptions } from './interfaces/config-options.interface';

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(@Inject(CONFIG_OPTIONS) private options: ConfigOptions) {
    let filePath = '.env';
    if (process.env.NODE_ENV !== 'local') {
      filePath = `.env.${process.env.NODE_ENV}`;
    }
    const envFile = path.resolve(__dirname, '../', options.folder, filePath);
    this.envConfig = dotenv.parse(fs.readFileSync(envFile));
    dotenv.config({ path: envFile });
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
