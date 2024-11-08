import { Router } from "express";
import { authenticateUser } from "../middlewares/authentication";
import {
  deleteUser,
  getAllUser,
  getSingleUser,
  showCurrentUser,
  updatePassword,
  updateUser,
} from "../controllers/userController";

const userRouter = Router();

userRouter.get("/", authenticateUser, getAllUser);
userRouter.get("/showCurrentUser", authenticateUser, showCurrentUser);
userRouter.get("/:id", authenticateUser, getSingleUser);
userRouter.post("/:id", authenticateUser, updateUser);
userRouter.delete("/:id", authenticateUser, deleteUser);
userRouter.put("/updatePassword", authenticateUser, updatePassword);

export default userRouter;
