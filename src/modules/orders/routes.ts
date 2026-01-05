import express from "express";
import {
  advanceOrderStateController,
  createOrderController,
  getOrdersController,
} from "./controller";
import { authMiddleware } from "../../middlewares/auth";

const router = express.Router();

router.post("/", authMiddleware, createOrderController);
router.get("/", authMiddleware, getOrdersController);
router.patch("/:id/advance", authMiddleware, advanceOrderStateController);

export default router;
