import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { FilmsModule } from './films/films.module';
import { ActorsModule } from './actors/actors.module';
import { LogsModule } from './logs/logs.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,
    ActorsModule,
    FilmsModule,
    LogsModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
