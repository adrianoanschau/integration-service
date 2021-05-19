import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@grazz/integration-service';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { HealthController } from './health/health.controller';

type IntegrationServiceModuleOptions = {
  configFolder?: string;
};

@Module({})
export class IntegrationServiceModule {
  static forRoot(
    options: IntegrationServiceModuleOptions = {
      configFolder: './',
    },
  ): DynamicModule {
    return {
      module: IntegrationServiceModule,
      imports: [
        ConfigModule.register({ folder: options.configFolder }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule.register({ folder: options.configFolder })],
          useFactory: (configService: ConfigService) => ({
            type: 'oracle',
            connectString: configService.get('DB_TNS'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_DATABASE'),
            autoLoadEntities: true,
          }),
          inject: [ConfigService],
        }),
        TerminusModule,
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
        ConfigService,
      ],
      controllers: [HealthController],
      exports: [ConfigService],
    };
  }
}
