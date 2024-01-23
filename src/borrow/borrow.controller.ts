import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { InsertBorrowData } from '../Types/RequestBody.dto';
import { CheckSelfUserActionGuard } from '../user/user.checkSelfAction.guard';
import { BorrowService } from './borrow.service';

@Controller('borrow')
export class BorrowController {
    public constructor(private borrowService:BorrowService){}

    @UseGuards(CheckSelfUserActionGuard)
    @Post()
    public async insertBorrow(@Body() borrowData:InsertBorrowData){
        return this.borrowService.insertBorrow(borrowData)
    }
}
