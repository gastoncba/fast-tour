import { Request, Response, NextFunction } from "express";
import * as boom from "@hapi/boom";

export const validateUserRole = (rols: any[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user: any = req.user;
    if (rols.includes(user.role.id)) {
      next();
    } else {
      next(boom.unauthorized());
    }
  };
};
