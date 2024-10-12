import { Test, TestingModule } from "@nestjs/testing";
import { ClassroomService } from "./classroom.service.ts";
import { beforeEach, describe, expect, it } from "@jest/globals";

describe("ClassroomService", () => {
	let service: ClassroomService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ClassroomService],
		}).compile();

		service = module.get<ClassroomService>(ClassroomService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
