import { Role, User } from "@prisma/client";
import jwt from "jsonwebtoken";

export const signToken = async (
  id: number,
  name: string,
  email: string,
  role: "USER" | "ADMIN"
) => {
  const secretKey =
    "f81eae361e0a19df15381cdb68a6bc11234ad5f15f0bdb00368438a0cad9e567";
  const payload = {
    id,
    name,
    email,
    role,
  };

  const token = jwt.sign(payload, secretKey, {
    expiresIn: "1d",
  });

  return token;
};
