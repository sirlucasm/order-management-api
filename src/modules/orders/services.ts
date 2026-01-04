import { Order } from "../../lib/mongoose/schemas";
import {
  createPagination,
  createResponseWithPagination,
} from "../../lib/utils";
import type { CreateOrderDto } from "./dto";

export const createOrderService = async (createOrderDto: CreateOrderDto) => {
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
