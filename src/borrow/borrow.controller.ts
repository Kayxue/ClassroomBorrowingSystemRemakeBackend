import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { InsertBorrowData, DeleteBorrowData } from "../Types/RequestBody.dto.ts";
import { CheckSelfUserActionGuard } from "../user/user.checkSelfAction.guard.ts";
import { BorrowService } from "./borrow.service.ts";
import { AuthenticatedGuard } from "../auth/authenticated.guard.ts";

@Controller("borrow")
export class BorrowController {
	public constructor(private borrowService: BorrowService) {}

	@UseGuards(CheckSelfUserActionGuard)
	@UseGuards(AuthenticatedGuard)
	@Post("/insertBorrow")
    public async insertBorrow(@Body() borrowData: InsertBorrowData) {
        return this.borrowService.insertBorrow(borrowData);
    }

	//TODO: Update Borrow Record

	@UseGuards(CheckSelfUserActionGuard)
	@UseGuards(AuthenticatedGuard)
	@Post("/deleteBorrow")
	public async deleteBorrow(@Body() borrowData: DeleteBorrowData) {
		return this.borrowService.deleteBorrowData(borrowData);
	}
}
