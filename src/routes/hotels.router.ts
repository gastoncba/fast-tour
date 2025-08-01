import express, { NextFunction, Request, Response } from "express";
import passport from "passport";

import { HotelService } from "../services/hotel.service";
import { validatorHandler, validateUserRole } from "../middleware/index";
import { getHotelSchema, createHotelSchema, updateHotelSchema, queryHotelSchema } from "../schemas/hotel.schema";

export const router = express.Router();
const hotelService = new HotelService();

router.get("/", validatorHandler(queryHotelSchema, "query"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, ...query } = req.query;
    const pageNumber = page ? parseInt(page as string) : 1;
    const limitNumber = limit ? parseInt(limit as string) : 10;
    
    const hotels = await hotelService.findPaginated(pageNumber, limitNumber, query);
    res.json(hotels);
  } catch (error) {
    next(error);
  }
});

router.get("/all", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hotels = await hotelService.find();
    res.json(hotels);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", validatorHandler(getHotelSchema, "params"), async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const hotel = await hotelService.findOne(id);
    res.json(hotel);
  } catch (error) {
    next(error);
  }
});

router.post("/", passport.authenticate("jwt", { session: false }), validateUserRole(["ADMIN"]), validatorHandler(createHotelSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
  const { body } = req;
  try {
    const hotel = await hotelService.create(body);
    res.status(201).json(hotel);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", passport.authenticate("jwt", { session: false }), validateUserRole(["ADMIN"]), validatorHandler(getHotelSchema, "params"), validatorHandler(updateHotelSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  const { id } = req.params;

  try {
    const hotel = await hotelService.update(id, body);
    res.json(hotel);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", passport.authenticate("jwt", { session: false }), validateUserRole(["ADMIN"]), async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    await hotelService.remove(id);
    res.json({
      message: `hotel #id ${id} delete`,
    });
  } catch (error) {
    next(error);
  }
});
