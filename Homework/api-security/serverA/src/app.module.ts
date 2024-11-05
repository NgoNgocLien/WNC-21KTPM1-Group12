import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { FilmsModule } from './films/films.module';
import { ActorsModule } from './actors/actors.module';
import { LogsModule } from './logs/logs.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, ActorsModule, FilmsModule, LogsModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
