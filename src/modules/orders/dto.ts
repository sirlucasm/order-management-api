import z from "zod";

export const createOrderDto = z.object({
  lab: z.string(),
  patient: z.string(),
  customer: z.string(),
  services: z.array(
    z.object({
      name: z.string(),
      value: z.number(),
    })
  ),
});

export type CreateOrderDto = z.infer<typeof createOrderDto>;
