import { Controller, Get, Query } from '@nestjs/common';
import { ClassroomService } from './classroom.service';

@Controller('classroom')
export class ClassroomController {
    public constructor(private classroomService: ClassroomService) { }

    @Get("get")
    public async getClassroom(@Query('id') id?: string) {
        return this.classroomService.getClassroom(id);
    }
}
