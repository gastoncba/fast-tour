import express, { NextFunction, Request, Response } from "express";

import { TravelsService } from "../services/travel.service";
import { validatorHandler } from "../middleware/validator.handler";
import {
  getTravelSchema,
  createTravelSchema,
  updateTravelSchema,
} from "../schemas/travel.schema";

export const router = express.Router();
const travelsService = new TravelsService();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const travels = await travelsService.find();
    res.json(travels);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id",
  validatorHandler(getTravelSchema, "params"),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const travel = await travelsService.findOne(id);
      res.json(travel);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  validatorHandler(createTravelSchema, "body"),
  async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;
    try {
      const travel = await travelsService.create(body);
      res.status(201).json({
        message: `Create`,
        data: travel,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:id",
  validatorHandler(getTravelSchema, "params"),
  validatorHandler(updateTravelSchema, "body"),
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const { id } = req.params;

    try {
      const travel = await travelsService.update(id, body);
      res.json({
        message: `update`,
        data: travel,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    await travelsService.remove(id)
    res.json({
      message: `travel #id ${id} delete`
    })
  } catch (error) {
    next(error)
  }
});
