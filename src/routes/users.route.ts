import express, { Request, Response, NextFunction } from "express";
import passport from "passport";

import { UserService } from "../services/user.service";
import { createUserSchema, getOrdersByUserSchema, queryUserSchema, updateUserSchema } from "../schemas/user.schema";
import { validatorHandler } from "../middleware/validator.handler";
import { validateUserRole } from "../middleware";

export const router = express.Router();
const userService = new UserService();

router.get("/all", passport.authenticate("jwt", { session: false }), validateUserRole(["ADMIN"]), validatorHandler(queryUserSchema, "query"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.find(req.query);
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.post("/create", validatorHandler(createUserSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req;
    const user = await userService.create(body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.get("/", passport.authenticate("jwt", { session: false }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload: any = req.user;
    const userId = payload.sub;
    const user = await userService.findById(userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.put("/update", passport.authenticate("jwt", { session: false }), validatorHandler(updateUserSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload: any = req.user;
    const userId = payload.sub;
    const changes = req.body;
    const updatedUser = await userService.update(userId, changes);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

router.get("/:userId/orders", passport.authenticate("jwt", { session: false }), validatorHandler(getOrdersByUserSchema, "params"), validatorHandler(queryUserSchema, "query"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const orders = await userService.searchOrders(userId, req.query);
    res.json(orders);
  } catch (error) {
    next(error);
  }
});
