import { Test, TestingModule } from "@nestjs/testing";
import { DepartmentController } from "./department.controller.ts";
import { describe, beforeEach, it, expect } from "@jest/globals";

describe("DepartmentController", () => {
	let controller: DepartmentController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [DepartmentController],
		}).compile();

		controller = module.get<DepartmentController>(DepartmentController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
