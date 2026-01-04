import type { Request, Response } from "express";
import { loginUserDto, registerUserDto } from "./dto";
import { loginUserService, registerUserService } from "./services";

export const registerUserController = async (req: Request, res: Response) => {
  const { email, password } = registerUserDto.parse(req.body);

  const response = await registerUserService({ email, password });

  res.json(response);
};

export const loginUserController = async (req: Request, res: Response) => {
  const { email, password } = loginUserDto.parse(req.body);

  const response = await loginUserService({ email, password });

  res.json(response);
};
