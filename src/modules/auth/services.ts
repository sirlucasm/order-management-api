import { ErrorResponse } from "../../lib/classes/error";
import { database } from "../../lib/mongoose";
import { User } from "../../lib/mongoose/schemas";
import jwt from "jsonwebtoken";
import type { LoginUserDto, RegisterUserDto } from "./dto";

const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

export const registerUserService = async (user: RegisterUserDto) => {
  const existingUser = await User.findOne({ email: user.email }).exec();

  if (existingUser) {
    throw new ErrorResponse("User already exists", 400);
  }

  const newUser = await User.create(user);

  const token = generateToken(newUser.id);

  return {
    user: {
      id: newUser.id,
      email: newUser.email,
    },
    token,
  };
};

export const loginUserService = async (user: LoginUserDto) => {
  const existingUser = await User.findOne({ email: user.email })
    .select("+password")
    .exec();

  if (!existingUser) {
    throw new ErrorResponse("Email or password is incorrect", 401);
  }

  const isPasswordValid = await existingUser.comparePassword(user.password);

  if (!isPasswordValid) {
    throw new ErrorResponse("Email or password is incorrect", 401);
  }

  const token = generateToken(existingUser.id);

  return {
    user: {
      id: existingUser.id,
      email: existingUser.email,
    },
    token,
  };
};
