import express, { NextFunction, Request, Response } from "express";
import passport from "passport";

import { OrderService } from "../services/order.service";
import { validateUserRole, validatorHandler } from "../middleware";
import { createOrderSchema, getOrderSchema } from "../schemas/order.schema";

export const router = express.Router();
const orderService = new OrderService();

router.post("/", validatorHandler(createOrderSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

router.get("/", passport.authenticate("jwt", { session: false }), validateUserRole(["ADMIN"]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await orderService.find();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", passport.authenticate("jwt", { session: false }), validateUserRole(["ADMIN"]), validatorHandler(getOrderSchema, "params"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await orderService.remove(id);
    res.json({ message: "deleted order" });
  } catch (error) {
    next(error);
  }
});
