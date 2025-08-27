import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  root(): { message: string; status: string } {
    return { message: 'Welcome to SEKUR Platform API', status: 'running' };
  }
}
