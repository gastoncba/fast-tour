import express, { NextFunction, Request, Response } from "express";

import { validatorHandler } from "../middleware/validator.handler";
import {
  createPlaceSchema,
  getPlaceSchema,
  updatePlaceSchema,
} from "../schemas/place.schema";
import { PlacesService } from "../services/place.service";

export const router = express.Router();
const placesService = new PlacesService();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const places = await placesService.find();
    res.json(places);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id",
  validatorHandler(getPlaceSchema, "params"),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const place = await placesService.findOne(id);
      res.json(place);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:id/travels",
  validatorHandler(getPlaceSchema, "params"),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const travels = await placesService.findTravels(id);
      res.json(travels);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  validatorHandler(createPlaceSchema, "body"),
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    try {
      const place = await placesService.create(body);
      res.status(201).json({
        message: `Create`,
        data: place,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:id",
  validatorHandler(getPlaceSchema, "params"),
  validatorHandler(updatePlaceSchema, "body"),
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const { id } = req.params;

    try {
      const travel = await placesService.update(id, body);
      res.json({
        message: `update`,
        data: travel,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      await placesService.remove(id);
      res.json({
        message: `place #id ${id} delete`,
      });
    } catch (error) {
      next(error);
    }
  }
);
