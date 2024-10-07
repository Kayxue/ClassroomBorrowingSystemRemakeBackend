import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { InsertBorrowData } from "../Types/RequestBody.dto";
import { CheckSelfUserActionGuard } from "../user/user.checkSelfAction.guard";
import { BorrowService } from "./borrow.service";
import { AuthenticatedGuard } from "src/auth/authenticated.guard";

@Controller("borrow")
export class BorrowController {
	public constructor(private borrowService: BorrowService) {}

	//Insert Borrow Record
	@UseGuards(CheckSelfUserActionGuard)
	@UseGuards(AuthenticatedGuard)
	@Post("/insertBorrow")
	public async insertBorrow(@Body() borrowData: InsertBorrowData) {
		return this.borrowService.insertBorrow(borrowData);
	}

	//TODO: Update Borrow Record
	//TODO: Delete Borrow Record
}
