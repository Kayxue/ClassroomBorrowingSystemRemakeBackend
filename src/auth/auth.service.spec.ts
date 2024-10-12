import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service.ts";
import { beforeEach, describe, expect, it } from "@jest/globals";

describe("AuthService", () => {
	let service: AuthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AuthService],
		}).compile();

		service = module.get<AuthService>(AuthService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
