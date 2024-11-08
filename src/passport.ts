import passport from "passport";
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  StrategyOptions,
} from "passport-jwt";
import { Request } from "express";
import { User } from "@prisma/client";

const secretKey =
  "f81eae361e0a19df15381cdb68a6bc11234ad5f15f0bdb00368438a0cad9e567"; // Your JWT secret

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from Bearer token
  secretOrKey: secretKey, // JWT Secret
};

passport.use(
  new JwtStrategy(options, async (jwtPayload, done) => {
    try {
      // Extract the email and userId from the payload
      const user = { id: jwtPayload.userId, email: jwtPayload.email };

      if (user) {
        // If user is found, return the user object
        return done(null, user);
      } else {
        // If no user is found, return false
        return done(null, false);
      }
    } catch (error) {
      // In case of an error, return the error
      return done(error, false);
    }
  })
);

export default passport;
