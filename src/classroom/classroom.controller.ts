import { Body, Controller, Delete, Get, ParseBoolPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { DeleteClassroomData, GetClassroomData, InsertClassroomData, UpdateClassroomData } from '../Types/RequestBody.dto';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { RequireAdminGuard } from '../user/user.requireAdminGuard.guard';

@Controller('classroom')
export class ClassroomController {
    public constructor(private classroomService: ClassroomService) { }

    @Get("/getClassroom")
    public async getClassroom(@Body() { classroomId }: GetClassroomData, @Query("borrows", new ParseBoolPipe({ optional: true })) borrows?: boolean) {
        return await this.classroomService.getClassroom(classroomId, borrows) ?? {};
    }

    @Get("/getClassrooms")
    public async getClassrooms(@Query("borrows", new ParseBoolPipe({ optional: true })) borrows?: boolean) {
        return this.classroomService.getClassrooms(borrows);
    }

    @UseGuards(RequireAdminGuard)
    @UseGuards(AuthenticatedGuard)
    @Post("/addClassroom")
    public async addClassroom(@Body() classroomData: InsertClassroomData) {
        return this.classroomService.insertClassroom(classroomData);
    }

    @UseGuards(RequireAdminGuard)
    @UseGuards(AuthenticatedGuard)
    @Patch("/updateClassroom")
    public async updateClassroom(@Body() classroomData: UpdateClassroomData) {
        return this.classroomService.updateClassroomData(classroomData);
    }

    @UseGuards(RequireAdminGuard)
    @UseGuards(AuthenticatedGuard)
    @Delete("deleteClassroom")
    public async deleteClassroom(@Body() classroomData: DeleteClassroomData) {
        return this.classroomService.deleteClassroomData(classroomData);
    }
}
