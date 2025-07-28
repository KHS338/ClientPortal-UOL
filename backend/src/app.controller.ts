import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-connection')
  testConnection() {
    return { 
      message: 'Backend connection successful', 
      timestamp: new Date(),
      status: 'OK' 
    };
  }

  @Get('health')
  healthCheck() {
    return { 
      status: 'healthy',
      timestamp: new Date(),
      service: 'client-portal-backend'
    };
  }
}
