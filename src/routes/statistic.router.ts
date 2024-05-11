import express, { NextFunction, Request, Response } from "express";
import { StatisticService } from "../services/statistic.service";

export const router = express.Router();
const statisticService = new StatisticService()

router.get("/general", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const general = await statisticService.generalStatistics()
    res.status(200).json(general)
  } catch (error) {
    next(error)
  }
})

router.get("/ranking", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ranking = await statisticService.ranking()
    res.status(200).json(ranking)
  } catch (error) {
    next(error)
  }
})
