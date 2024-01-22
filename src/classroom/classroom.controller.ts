import { Body, Controller, Delete, Get, ParseBoolPipe, Patch, Post, Query } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { DeleteClassroomData, GetClassroomData, InsertClassroomData } from '../Types/RequestBody.dto';

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

    @Post("/addClassroom")
    public async addClassroom(@Body() classroomData: InsertClassroomData) {
        return this.classroomService.insertClassroom(classroomData);
    }

    @Patch("updateClassroom")
    public async updateClassroom() {

    }

    @Delete("deleteClassroom")
    public async deleteClassroom(@Body() classroomData: DeleteClassroomData) {
        return this.classroomService.deleteClassroomData(classroomData);
    }
}
