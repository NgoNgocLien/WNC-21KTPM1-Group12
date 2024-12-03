import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    // Synchronous method
  getSyncData(): string {
    return 'Synchronous api';
  }

  // Asynchronous method
  async getAsyncData(): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('Asynchronous api');
      }, 2000);
    });
  }
}
