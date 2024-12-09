import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service.ts";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public welcome(): string {
    return this.appService.sendWelcome();
  }
}
