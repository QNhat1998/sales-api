import { Controller, Get, Res, All } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  redirectToApiDocs(@Res() response: Response) {
    return response.redirect('/api');
  }

  catchAll(@Res() response: Response) {
    return response.redirect('/api');
  }
}
