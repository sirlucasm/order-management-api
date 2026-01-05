import { isValidObjectId } from "mongoose";
import { ErrorResponse } from "../../lib/classes/error";
import { Order } from "../../lib/mongoose/schemas";
import {
  advanceOrderState,
  createPagination,
  createResponseWithPagination,
} from "../../lib/utils";
import type { CreateOrderDto } from "./dto";

export const createOrderService = async (createOrderDto: CreateOrderDto) => {
  if (createOrderDto.services.length === 0) {
    throw new ErrorResponse("Services are required", 400);
  }

  const someServiceWithZeroValue = createOrderDto.services.some(
    (service) => service.value === 0
  );

  if (someServiceWithZeroValue) {
    throw new ErrorResponse("Some service has zero value", 400);
  }

  const orderCreated = await Order.create(createOrderDto);

  return orderCreated;
};

export const getOrdersService = async ({
  page = "1",
  limit = "10",
}: {
  page?: string;
  limit?: string;
}) => {
  const ordersTotal = await Order.countDocuments().exec();

  const pagination = createPagination({
    page,
    limit,
    total: ordersTotal,
  });

  const orders = await Order.find()
    .skip(pagination.skip)
    .limit(pagination.limit)
    .exec();

  return createResponseWithPagination(orders, pagination);
};

export const advanceOrderStateService = async ({
  orderId,
}: {
  orderId: string;
}) => {
  if (!isValidObjectId(orderId)) {
    throw new ErrorResponse("Invalid order ID", 400);
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ErrorResponse("Order not found", 404);
  }

  const nextState = advanceOrderState(order.state);

  order.state = nextState;

  await order.save();

  return order;
};
