import express, { Request, Response, NextFunction } from "express";
import passport from "passport";

import { UserService } from "../services/user.service";
import { createUserSchema, getOrdersByUserSchema, queryUserSchema, sendMessageSchema, updateUserSchema } from "../schemas/user.schema";
import { validatorHandler } from "../middleware/validator.handler";
import { validateUserRole } from "../middleware";

export const router = express.Router();
const userService = new UserService();

router.get("/all", passport.authenticate("jwt", { session: false }), validateUserRole(["ADMIN"]), validatorHandler(queryUserSchema, "query"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, ...query } = req.query;
    const pageNumber = page ? parseInt(page as string) : 1;
    const limitNumber = limit ? parseInt(limit as string) : 10;
    
    const users = await userService.findPaginated(pageNumber, limitNumber, query);
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
    const user = await userService.findOne(userId);
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

router.delete("/:userId", passport.authenticate("jwt", { session: false }), validatorHandler(getOrdersByUserSchema, "params"), validatorHandler(queryUserSchema, "query"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    await userService.remove(userId);
    res.json({ message: `user #${userId} deleted` });
  } catch (error) {
    next(error);
  }
});

router.post("/:userId/send-message", passport.authenticate("jwt", { session: false }), validatorHandler(getOrdersByUserSchema, "params"), validatorHandler(sendMessageSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const { message } = req.body;
    await userService.sendMessage(userId, message);
    res.json({ message: `message sended` });
  } catch (error) {
    next(error);
  }
});
