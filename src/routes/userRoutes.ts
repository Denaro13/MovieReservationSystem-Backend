import { Router } from "express";
import {
  authenticateUser,
  authorizePermissions,
} from "../middlewares/authentication";
import {
  deleteUser,
  getAllUser,
  getSingleUser,
  showCurrentUser,
  updatePassword,
  updateUser,
} from "../controllers/userController";

const userRouter = Router();

userRouter.get(
  "/",
  authenticateUser,
  authorizePermissions("ADMIN"),
  getAllUser
);
userRouter.get("/showCurrentUser", authenticateUser, showCurrentUser);
userRouter.patch("/updatePassword", authenticateUser, updatePassword);
userRouter.patch("/:id", authenticateUser, updateUser);
userRouter.get("/:id", authenticateUser, getSingleUser);
userRouter.delete(
  "/:id",
  authenticateUser,
  authorizePermissions("ADMIN"),
  deleteUser
);

export default userRouter;
