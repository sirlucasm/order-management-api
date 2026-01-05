import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  resetMocks,
  mockFindOne,
  mockExec,
  mockCreate,
  mockJwtSign,
  createQueryMock,
} from "../../__mocks__/setup";
import {
  createMockUser,
  createMockRegisterDto,
  createMockLoginDto,
  createMockToken,
} from "../../__mocks__/user";

vi.mock("../../lib/mongoose", () => ({
  database: {},
}));

vi.mock("../../lib/mongoose/schemas", () => ({
  User: {
    findOne: mockFindOne,
    create: mockCreate,
  },
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: mockJwtSign,
  },
}));

mockFindOne.mockReturnValue(createQueryMock());

import { registerUserService, loginUserService } from "./services";
import { ErrorResponse } from "../../lib/classes/error";

describe("Auth Services", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret-key";
    resetMocks();
  });

  describe("registerUserService", () => {
    it("should register a new user successfully", async () => {
      const userData = createMockRegisterDto();
      const mockUser = createMockUser({ email: userData.email });
      const mockToken = createMockToken();

      mockExec.mockResolvedValue(null);
      mockCreate.mockResolvedValue(mockUser as any);
      mockJwtSign.mockReturnValue(mockToken);

      const result = await registerUserService(userData);

      expect(mockFindOne).toHaveBeenCalledWith({ email: userData.email });
      expect(mockCreate).toHaveBeenCalledWith(userData);
      expect(mockJwtSign).toHaveBeenCalledWith(
        { id: mockUser.id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
        },
        token: mockToken,
      });
    });

    it("should throw error when user already exists", async () => {
      const userData = createMockRegisterDto();
      const existingUser = createMockUser({ email: userData.email });

      mockExec.mockResolvedValue(existingUser);

      await expect(registerUserService(userData)).rejects.toThrow(
        ErrorResponse
      );
      await expect(registerUserService(userData)).rejects.toThrow(
        "User already exists"
      );

      expect(mockFindOne).toHaveBeenCalledWith({ email: userData.email });
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  describe("loginUserService", () => {
    it("should login successfully", async () => {
      const userData = createMockLoginDto();
      const mockUser = {
        ...createMockUser({ email: userData.email }),
        comparePassword: vi.fn().mockResolvedValue(true) as any,
      };
      const mockToken = createMockToken();

      mockExec.mockResolvedValue(mockUser);
      mockJwtSign.mockReturnValue(mockToken);

      const result = await loginUserService(userData);

      expect(mockFindOne).toHaveBeenCalledWith({ email: userData.email });
      const queryResult = mockFindOne.mock.results[0]?.value;
      expect(queryResult?.select).toHaveBeenCalledWith("+password");
      expect(mockUser.comparePassword).toHaveBeenCalledWith(userData.password);
      expect(mockJwtSign).toHaveBeenCalledWith(
        { id: mockUser.id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
        },
        token: mockToken,
      });
    });

    it("should throw error when user does not exist", async () => {
      const userData = createMockLoginDto();

      mockExec.mockResolvedValue(null);

      await expect(loginUserService(userData)).rejects.toThrow(ErrorResponse);
      await expect(loginUserService(userData)).rejects.toThrow(
        "Email or password is incorrect"
      );

      expect(mockFindOne).toHaveBeenCalledWith({ email: userData.email });
      const queryResult = mockFindOne.mock.results[0]?.value;
      expect(queryResult?.select).toHaveBeenCalledWith("+password");
    });

    it("should throw error when password is incorrect", async () => {
      const userData = createMockLoginDto();
      const mockUser = {
        ...createMockUser({ email: userData.email }),
        comparePassword: vi.fn().mockResolvedValue(false) as any,
      };

      mockExec.mockResolvedValue(mockUser);

      await expect(loginUserService(userData)).rejects.toThrow(ErrorResponse);
      await expect(loginUserService(userData)).rejects.toThrow(
        "Email or password is incorrect"
      );

      expect(mockFindOne).toHaveBeenCalledWith({ email: userData.email });
      const queryResult = mockFindOne.mock.results[0]?.value;
      expect(queryResult?.select).toHaveBeenCalledWith("+password");
      expect(mockUser.comparePassword).toHaveBeenCalledWith(userData.password);
      expect(mockJwtSign).not.toHaveBeenCalled();
    });
  });
});
