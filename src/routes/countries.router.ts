import express, { NextFunction, Request, Response } from "express";

import { validatorHandler } from "../middleware/validator.handler";
import {
  getCountrySchema,
  createCountrySchema,
  updateCountrySchema,
  queryCountrySchema
} from '../schemas/country.schema'
import { CountriesService } from "../services/country.service";

export const router = express.Router();
const countriesService = new CountriesService();

router.get("/",
  validatorHandler(queryCountrySchema, "query"),
  async (req: Request, res: Response, next: NextFunction) => {
  try {
    const countries = await countriesService.find(req.query);
    res.json(countries);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id",
  validatorHandler(getCountrySchema, "params"),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const country = await countriesService.findOne(id);
      res.json(country);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  validatorHandler(createCountrySchema, "body"),
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    try {
      const country = await countriesService.create(body);
      res.status(201).json({
        message: `Create`,
        data: country,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:id",
  validatorHandler(getCountrySchema, "params"),
  validatorHandler(updateCountrySchema, "body"),
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const { id } = req.params;

    try {
      const country = await countriesService.update(id, body);
      res.json({
        message: `update`,
        data: country,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    await countriesService.remove(id)
    res.json({
      message: `country #id ${id} delete`
    })
  } catch (error) {
    next(error)
  }
});
