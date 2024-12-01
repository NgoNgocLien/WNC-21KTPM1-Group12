import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { FilmsModule } from './films/films.module';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [
    DatabaseModule,
    FilmsModule,
    LogsModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
