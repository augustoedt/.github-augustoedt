import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common';
@Controller()
export class AppController {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  @Get('status')
  async status(): Promise<{ status: string }> {
    return { status: 'live' };
  }
}
