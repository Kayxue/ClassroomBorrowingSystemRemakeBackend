import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  public sendWelcome(): string {
    return "Welcome to API of ClassroomBorrowingSystem";
  }
}
