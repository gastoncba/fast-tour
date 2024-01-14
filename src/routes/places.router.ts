import express, { NextFunction, Request, Response } from "express";

import { validatorHandler } from "../middleware/validator.handler";
import { createPlaceSchema, getPlaceSchema, updatePlaceSchema } from "../schemas/place.schema";
import { PlaceService } from "../services/place.service";

export const router = express.Router();
const placeService = new PlaceService();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const places = await placeService.find();
    res.json(places);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", validatorHandler(getPlaceSchema, "params"), async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const place = await placeService.findOne(id);
    res.json(place);
  } catch (error) {
    next(error);
  }
});

router.post("/", validatorHandler(createPlaceSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  try {
    const place = await placeService.create(body);
    res.status(201).json(place);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", validatorHandler(getPlaceSchema, "params"), validatorHandler(updatePlaceSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  const { id } = req.params;

  try {
    const place = await placeService.update(id, body);
    res.json(place);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    await placeService.remove(id);
    res.json({
      message: `place #id ${id} delete`,
    });
  } catch (error) {
    next(error);
  }
});
