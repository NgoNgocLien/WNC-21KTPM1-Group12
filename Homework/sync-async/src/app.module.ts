import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppService } from './app/app.service';
import { AppController } from './app/app.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'), // Path to the folder containing static files
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
