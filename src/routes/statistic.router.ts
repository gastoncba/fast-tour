import express, { NextFunction, Request, Response } from "express";

import { StatisticService } from "../services/statistic.service";
import { validatorHandler } from "../middleware";
import { getFrequencySchema } from "../schemas/statistics.schema";

export const router = express.Router();
const statisticService = new StatisticService();

router.get("/general", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const general = await statisticService.generalStatistics();
    res.status(200).json(general);
  } catch (error) {
    next(error);
  }
});

router.get("/ranking", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ranking = await statisticService.ranking();
    res.status(200).json(ranking);
  } catch (error) {
    next(error);
  }
});

router.get("/frequency/:year", validatorHandler(getFrequencySchema, "params"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { year } = req.params;
    const trips = await statisticService.getMonthlyTripCounts(parseInt(year));
    res.status(200).json(trips);
  } catch (error) {
    next(error);
  }
});
