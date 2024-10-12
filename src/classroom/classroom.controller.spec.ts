import { Test, TestingModule } from "@nestjs/testing";
import { ClassroomController } from "./classroom.controller.ts";
import { beforeEach, describe, expect, it } from "@jest/globals";

describe("ClassroomController", () => {
	let controller: ClassroomController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ClassroomController],
		}).compile();

		controller = module.get<ClassroomController>(ClassroomController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
