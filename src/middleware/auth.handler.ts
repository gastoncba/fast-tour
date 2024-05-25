import { Request, Response, NextFunction } from "express";
import * as boom from "@hapi/boom";

type Role = "CUSTOMER" | "ADMIN"

export const validateUserRole = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user: any = req.user;
    if (roles.includes(user.role)) {
      next();
    } else {
      next(boom.unauthorized());
    }
  };
};
