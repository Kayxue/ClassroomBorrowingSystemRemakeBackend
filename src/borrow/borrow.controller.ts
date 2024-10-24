import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { InsertBorrowData } from "../Types/RequestBody.dto.ts";
import { CheckSelfUserActionGuard } from "../user/user.checkSelfAction.guard.ts";
import { BorrowService } from "./borrow.service.ts";
import { AuthenticatedGuard } from "../auth/authenticated.guard.ts";

@Controller("borrow")
export class BorrowController {
	public constructor(private borrowService: BorrowService) {}

	//Insert Borrow Record
	@UseGuards(CheckSelfUserActionGuard)
	@UseGuards(AuthenticatedGuard)
	@Post("/insertBorrow")
    public async createBorrow(@Body() borrowData: InsertBorrowData) {
        return await this.borrowService.insertBorrow(borrowData);
    }

	//TODO: Update Borrow Record
	//TODO: Delete Borrow Record
}
