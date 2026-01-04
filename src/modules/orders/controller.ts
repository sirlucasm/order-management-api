import { createOrderDto } from "./dto";
import { createOrderService, getOrdersService } from "./services";
import type { Request, Response } from "express";

export const createOrderController = async (req: Request, res: Response) => {
  const { lab, patient, customer, services } = createOrderDto.parse(req.body);

  const response = await createOrderService({
    lab,
    patient,
    customer,
    services,
  });

  res.json(response);
};

export const getOrdersController = async (req: Request, res: Response) => {
  const { page, limit } = req.query;

  const orders = await getOrdersService({
    page: page as string,
    limit: limit as string,
  });

  res.json(orders);
};
