import { Router } from "express";
import router from "./authRoutes";
import {
  authenticateUser,
  authorizePermissions,
} from "../middlewares/authentication";
import {
  getAllReservation,
  seatReservationForAShowTime,
} from "../controllers/reservationController";

const reservationRouter = Router();

reservationRouter.get(
  "",
  authenticateUser,
  authorizePermissions("ADMIN"),
  getAllReservation
);
reservationRouter.post(
  "/:showTimeId",
  authenticateUser,
  seatReservationForAShowTime
);

export default reservationRouter;
