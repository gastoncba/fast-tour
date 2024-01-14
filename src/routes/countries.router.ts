import express, { NextFunction, Request, Response } from "express";

import { validatorHandler } from "../middleware/validator.handler";
import { getCountrySchema, createCountrySchema, updateCountrySchema, queryCountrySchema } from "../schemas/country.schema";
import { CountryService } from "../services/country.service";

export const router = express.Router();
const countryService = new CountryService();

router.get("/", validatorHandler(queryCountrySchema, "query"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const countries = await countryService.find(req.query);
    res.json(countries);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", validatorHandler(getCountrySchema, "params"), async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const country = await countryService.findOne(id);
    res.json(country);
  } catch (error) {
    next(error);
  }
});

router.post("/", validatorHandler(createCountrySchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  try {
    const country = await countryService.create(body);
    res.status(201).json(country);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", validatorHandler(getCountrySchema, "params"), validatorHandler(updateCountrySchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  const { id } = req.params;

  try {
    const country = await countryService.update(id, body);
    res.json(country);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    await countryService.remove(id);
    res.json({
      message: `country #id ${id} delete`,
    });
  } catch (error) {
    next(error);
  }
});
