import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { FilmsModule } from './films/films.module';
import { ActorsModule } from './actors/actors.module';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [DatabaseModule, ActorsModule, FilmsModule, LogsModule],
})
export class AppModule {}
