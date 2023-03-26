import express, { NextFunction, Request, Response } from "express";

import { HotelService } from "../services/hotel.service";
import { validatorHandler } from "../middleware/validator.handler";
import {
  getHotelSchema,
  createHotelSchema,
  updateHotelSchema,
} from "../schemas/hotel.schema";

export const router = express.Router();
const hotelServices = new HotelService();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hotels = await hotelServices.find();
    res.json(hotels);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id",
  validatorHandler(getHotelSchema, "params"),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const hotel = await hotelServices.findOne(id);
      res.json(hotel);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  validatorHandler(createHotelSchema, "body"),
  async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;
    try {
      const hotel = await hotelServices.create(body);
      res.status(201).json({
        message: `Create`,
        data: hotel,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:id",
  validatorHandler(getHotelSchema, "params"),
  validatorHandler(updateHotelSchema, "body"),
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const { id } = req.params;

    try {
      const hotel = await hotelServices.update(id, body);
      res.json({
        message: `update`,
        data: hotel,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    await hotelServices.remove(id)
    res.json({
      message: `hotel #id ${id} delete`
    })
  } catch (error) {
    next(error)
  }
});
