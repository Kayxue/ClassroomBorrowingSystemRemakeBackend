import { Controller, Get, ParseBoolPipe, Query } from '@nestjs/common';
import { ClassroomService } from './classroom.service';

@Controller('classroom')
export class ClassroomController {
    public constructor(private classroomService: ClassroomService) { }

    @Get("getClassroom")
    public async getClassroom(@Query('id') id?: string, @Query("borrows", new ParseBoolPipe({ optional: true })) borrows?: boolean) {
        return this.classroomService.getClassroom(id, borrows);
    }
}
