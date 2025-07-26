import express, { NextFunction, Request, Response } from "express";
import passport from "passport";

import { TripService } from "../services/trip.service";
import { validatorHandler, validateUserRole } from "../middleware/index";
import { getTripSchema, createTripSchema, updateTripSchema, queryTripSchema } from "../schemas/trip.schema";

export const router = express.Router();
const tripService = new TripService();

router.get("/", validatorHandler(queryTripSchema, "query"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, ...query } = req.query;
    const pageNumber = page ? parseInt(page as string) : 1;
    const limitNumber = limit ? parseInt(limit as string) : 10;
    
    const trips = await tripService.findPaginated(pageNumber, limitNumber, query);
    res.json(trips);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", validatorHandler(getTripSchema, "params"), async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const travel = await tripService.findOne(id);
    res.json(travel);
  } catch (error) {
    next(error);
  }
});

router.post("/", passport.authenticate("jwt", { session: false }), validateUserRole(["ADMIN"]), validatorHandler(createTripSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
  const { body } = req;
  try {
    const trip = await tripService.create(body);
    res.status(201).json(trip);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", passport.authenticate("jwt", { session: false }), validateUserRole(["ADMIN"]), validatorHandler(getTripSchema, "params"), validatorHandler(updateTripSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  const { id } = req.params;

  try {
    const trip = await tripService.update(id, body);
    res.json(trip);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", passport.authenticate("jwt", { session: false }), validateUserRole(["ADMIN"]), async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    await tripService.remove(id);
    res.json({
      message: `trip #id ${id} delete`,
    });
  } catch (error) {
    next(error);
  }
});
