import express, { NextFunction, Request, Response } from "express";
import passport from "passport";

import { validatorHandler, validateUserRole } from "../middleware/index";
import { createPlaceSchema, getPlaceSchema, queryPlaceSchema, updatePlaceSchema } from "../schemas/place.schema";
import { PlaceService } from "../services/place.service";

export const router = express.Router();
const placeService = new PlaceService();

router.get("/", validatorHandler(queryPlaceSchema, "query"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const places = await placeService.find(req.query);
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

router.post("/", passport.authenticate("jwt", { session: false }), validateUserRole(["ADMIN"]), validatorHandler(createPlaceSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  try {
    const place = await placeService.create(body);
    res.status(201).json(place);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", passport.authenticate("jwt", { session: false }), validateUserRole(["ADMIN"]), validatorHandler(getPlaceSchema, "params"), validatorHandler(updatePlaceSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  const { id } = req.params;

  try {
    const place = await placeService.update(id, body);
    res.json(place);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", passport.authenticate("jwt", { session: false }), validateUserRole(["ADMIN"]), async (req: Request, res: Response, next: NextFunction) => {
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
