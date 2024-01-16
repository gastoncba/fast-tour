import express, { NextFunction, Request, Response } from "express";

import { RoleService } from "../services/role.service";

const roleService = new RoleService();
export const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roles = await roleService.find();
    res.json(roles);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  try {
    const country = await roleService.create(body);
    res.status(201).json(country);
  } catch (error) {
    next(error);
  }
});
