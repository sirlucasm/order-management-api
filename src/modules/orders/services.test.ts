import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  resetMocks,
  mockFindById,
  mockFind,
  mockCountDocuments,
  mockExec,
  mockCreate,
  mockSkip,
  mockLimit,
  createFindQueryMock,
} from "../../__mocks__/setup";

vi.mock("../../lib/mongoose", () => ({
  database: {},
}));

vi.mock("../../lib/mongoose/schemas", () => ({
  Order: {
    findById: mockFindById,
    find: mockFind,
    countDocuments: mockCountDocuments,
    create: mockCreate,
  },
}));

mockFind.mockReturnValue(createFindQueryMock());
mockCountDocuments.mockReturnValue({
  exec: mockExec,
});
import {
  createMockOrder,
  createMockCreateOrderDto,
} from "../../__mocks__/order";
import {
  createOrderService,
  getOrdersService,
  advanceOrderStateService,
} from "./services";
import { ErrorResponse } from "../../lib/classes/error";

describe("Orders Services", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("createOrderService", () => {
    it("should create an order successfully", async () => {
      const orderData = createMockCreateOrderDto();
      const mockOrder = createMockOrder({
        lab: orderData.lab,
        patient: orderData.patient,
        customer: orderData.customer,
        services: orderData.services,
      });

      mockCreate.mockResolvedValue(mockOrder as any);

      const result = await createOrderService(orderData);

      expect(mockCreate).toHaveBeenCalledWith(orderData);
      expect(result).toEqual(mockOrder);
    });

    it("should throw error when there are no services", async () => {
      const orderData = createMockCreateOrderDto({
        services: [],
      });

      await expect(createOrderService(orderData)).rejects.toThrow(
        ErrorResponse
      );
      await expect(createOrderService(orderData)).rejects.toThrow(
        "Services are required"
      );

      expect(mockCreate).not.toHaveBeenCalled();
    });

    it("should throw error when some service has zero value", async () => {
      const orderData = createMockCreateOrderDto({
        services: [
          {
            name: "Service 1",
            value: 100,
          },
          {
            name: "Service 2",
            value: 0,
          },
        ],
      });

      await expect(createOrderService(orderData)).rejects.toThrow(
        ErrorResponse
      );
      await expect(createOrderService(orderData)).rejects.toThrow(
        "Some service has zero value"
      );

      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  describe("getOrdersService", () => {
    it("should return orders with pagination", async () => {
      const mockOrders = [
        createMockOrder(),
        createMockOrder(),
        createMockOrder(),
      ];
      const totalOrders = 3;

      mockExec
        .mockResolvedValueOnce(totalOrders)
        .mockResolvedValueOnce(mockOrders);

      const result = await getOrdersService({ page: "1", limit: "10" });

      expect(mockCountDocuments).toHaveBeenCalled();
      expect(mockFind).toHaveBeenCalled();
      expect(mockSkip).toHaveBeenCalledWith(0);
      expect(mockLimit).toHaveBeenCalledWith(10);
      expect(result.data).toEqual(mockOrders);
      expect(result.pagination.total).toBe(totalOrders);
      expect(result.pagination.currentPage).toBe(1);
    });

    it("should use default values when page and limit are not provided", async () => {
      const mockOrders = [createMockOrder()];
      const totalOrders = 1;

      mockExec
        .mockResolvedValueOnce(totalOrders)
        .mockResolvedValueOnce(mockOrders);

      const result = await getOrdersService({});

      expect(mockSkip).toHaveBeenCalledWith(0);
      expect(mockLimit).toHaveBeenCalledWith(10);
      expect(result.pagination.currentPage).toBe(1);
    });
  });

  describe("advanceOrderStateService", () => {
    it("should advance state from CREATED to ANALYSIS", async () => {
      const orderId = "507f1f77bcf86cd799439011";
      const mockOrder: any = createMockOrder({
        _id: orderId,
        id: orderId,
        state: "CREATED",
      });

      mockOrder.save = vi.fn().mockImplementation(async () => {
        mockOrder.state = "ANALYSIS";
        return mockOrder;
      });

      mockFindById.mockResolvedValue(mockOrder);

      const result = await advanceOrderStateService({ orderId });

      expect(mockFindById).toHaveBeenCalledWith(orderId);
      expect(mockOrder.save).toHaveBeenCalled();
      expect(result.state).toBe("ANALYSIS");
    });

    it("should advance state from ANALYSIS to COMPLETED", async () => {
      const orderId = "507f1f77bcf86cd799439011";
      const mockOrder: any = createMockOrder({
        _id: orderId,
        id: orderId,
        state: "ANALYSIS",
      });

      mockOrder.save = vi.fn().mockImplementation(async () => {
        mockOrder.state = "COMPLETED";
        return mockOrder;
      });

      mockFindById.mockResolvedValue(mockOrder);

      const result = await advanceOrderStateService({ orderId });

      expect(mockFindById).toHaveBeenCalledWith(orderId);
      expect(mockOrder.save).toHaveBeenCalled();
      expect(result.state).toBe("COMPLETED");
    });

    it("should keep COMPLETED state when already completed", async () => {
      const orderId = "507f1f77bcf86cd799439011";
      const mockOrder: any = createMockOrder({
        _id: orderId,
        id: orderId,
        state: "COMPLETED",
      });

      mockOrder.save = vi.fn().mockImplementation(async () => {
        mockOrder.state = "COMPLETED";
        return mockOrder;
      });

      mockFindById.mockResolvedValue(mockOrder);

      const result = await advanceOrderStateService({ orderId });

      expect(mockFindById).toHaveBeenCalledWith(orderId);
      expect(mockOrder.save).toHaveBeenCalled();
      expect(result.state).toBe("COMPLETED");
    });

    it("should throw error when order ID is invalid", async () => {
      const invalidOrderId = "invalid-id";

      await expect(
        advanceOrderStateService({ orderId: invalidOrderId })
      ).rejects.toThrow(ErrorResponse);
      await expect(
        advanceOrderStateService({ orderId: invalidOrderId })
      ).rejects.toThrow("Invalid order ID");

      expect(mockFindById).not.toHaveBeenCalled();
    });

    it("should throw error when order is not found", async () => {
      const orderId = "507f1f77bcf86cd799439011";

      mockFindById.mockResolvedValue(null);

      await expect(advanceOrderStateService({ orderId })).rejects.toThrow(
        ErrorResponse
      );
      await expect(advanceOrderStateService({ orderId })).rejects.toThrow(
        "Order not found"
      );

      expect(mockFindById).toHaveBeenCalledWith(orderId);
    });

    it("should ensure invalid transitions are blocked", async () => {
      const orderId = "507f1f77bcf86cd799439011";

      const mockOrderCreated: any = createMockOrder({
        _id: orderId,
        id: orderId,
        state: "CREATED",
      });

      mockOrderCreated.save = vi.fn().mockImplementation(async () => {
        mockOrderCreated.state = "ANALYSIS";
        return mockOrderCreated;
      });

      mockFindById.mockResolvedValue(mockOrderCreated);

      const result1 = await advanceOrderStateService({ orderId });
      expect(result1.state).toBe("ANALYSIS");

      const mockOrderAnalysis: any = createMockOrder({
        _id: orderId,
        id: orderId,
        state: "ANALYSIS",
      });

      mockOrderAnalysis.save = vi.fn().mockImplementation(async () => {
        mockOrderAnalysis.state = "COMPLETED";
        return mockOrderAnalysis;
      });

      mockFindById.mockResolvedValue(mockOrderAnalysis);

      const result2 = await advanceOrderStateService({ orderId });
      expect(result2.state).toBe("COMPLETED");
    });

    it("should ensure states cannot be reverted", async () => {
      const orderId = "507f1f77bcf86cd799439011";

      const mockOrderCompleted: any = createMockOrder({
        _id: orderId,
        id: orderId,
        state: "COMPLETED",
      });

      mockOrderCompleted.save = vi.fn().mockImplementation(async () => {
        mockOrderCompleted.state = "COMPLETED";
        return mockOrderCompleted;
      });

      mockFindById.mockResolvedValue(mockOrderCompleted);

      const result = await advanceOrderStateService({ orderId });

      expect(result.state).toBe("COMPLETED");
      expect(result.state).not.toBe("ANALYSIS");
      expect(result.state).not.toBe("CREATED");
    });
  });
});
