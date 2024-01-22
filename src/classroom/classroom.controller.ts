import { Body, Controller, Get, ParseBoolPipe, Query } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { GetClassroomData } from '../Types/RequestBody.dto';

@Controller('classroom')
export class ClassroomController {
    public constructor(private classroomService: ClassroomService) { }

    @Get("/getClassroom")
    public async getClassroom(@Body() { classroomId }: GetClassroomData, @Query("borrows", new ParseBoolPipe({ optional: true })) borrows?: boolean) {
        return this.classroomService.getClassroom(classroomId, borrows);
    }

    @Get("/getClassrooms")
    public async getClassrooms(@Query("borrows", new ParseBoolPipe({ optional: true })) borrows?: boolean) {
        return this.classroomService.getClassrooms(borrows);
    }
}
