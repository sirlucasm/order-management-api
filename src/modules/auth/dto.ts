import z from "zod";

export const registerUserDto = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export type RegisterUserDto = z.infer<typeof registerUserDto>;

export const loginUserDto = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export type LoginUserDto = z.infer<typeof loginUserDto>;
