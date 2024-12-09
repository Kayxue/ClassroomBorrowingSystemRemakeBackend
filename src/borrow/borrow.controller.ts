import {
	Body,
	Controller,
	Get,
	Post,
	UseGuards,
	ValidationPipe,
} from "@nestjs/common";
import {
	DeleteBorrowData,
	InsertBorrowData,
} from "../Types/RequestBody.dto.ts";
import { CheckSelfUserActionGuard } from "../user/user.checkSelfAction.guard.ts";
import { BorrowService } from "./borrow.service.ts";
import { AuthenticatedGuard } from "../auth/authenticated.guard.ts";

@Controller("borrow")
export class BorrowController {
	public constructor(private borrowService: BorrowService) {}

	@UseGuards(AuthenticatedGuard, CheckSelfUserActionGuard)
	@Post("/insertBorrow")
	public async insertBorrow(
		@Body(new ValidationPipe()) borrowData: InsertBorrowData,
	) {
		return this.borrowService.insertBorrow(borrowData);
	}

	@UseGuards(AuthenticatedGuard, CheckSelfUserActionGuard)
	@Post("/deleteBorrow")
	public async deleteBorrow(
		@Body(new ValidationPipe()) borrowData: DeleteBorrowData,
	) {
		return this.borrowService.deleteBorrowData(borrowData);
	}

	// TODO: Retrieve borrowing records of today
	@UseGuards(AuthenticatedGuard)
	@Get("getTodayBorrow")
	public async getTodayBorrow() {
		return this.borrowService.getTodaysBorrow();
	}
}
