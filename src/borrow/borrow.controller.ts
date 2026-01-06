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
} from "../Types/RequestBody.dto";
import { CheckSelfUserActionGuard } from "../user/user.checkSelfAction.guard";
import { BorrowService } from "./borrow.service";
import { AuthenticatedGuard } from "../auth/authenticated.guard";

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

	@UseGuards(AuthenticatedGuard)
	@Get("getTodayBorrow")
	public async getTodayBorrow() {
		return this.borrowService.getTodaysBorrow();
	}
}
