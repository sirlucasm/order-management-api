import express from "express";
import { createOrderController, getOrdersController } from "./controller";
import { authMiddleware } from "../../middlewares/auth";

const router = express.Router();

router.post("/", authMiddleware, createOrderController);
router.get("/", authMiddleware, getOrdersController);

export default router;
