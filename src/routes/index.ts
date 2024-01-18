import express, { Express } from "express";
import { router as tripsRouter } from "./trips.router";
import { router as usersRouter } from "./users.route";
import { router as placesRouter } from "./places.router";
import { router as countriesRouter } from "./countries.router";
import { router as hotelsRouter } from "./hotels.router";
import { router as rolesRouter } from "./roles.router";
import { router as authRouter } from "./auth.router";

export const routerApi = (app: Express) => {
  const router = express.Router();
  app.use("/api", router);
  router.use("/trips", tripsRouter);
  router.use("/users", usersRouter);
  router.use("/places", placesRouter);
  router.use("/countries", countriesRouter);
  router.use("/hotels", hotelsRouter);
  router.use("/roles", rolesRouter);
  router.use("/auth", authRouter);
};
