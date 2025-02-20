import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { jwtSecret } from "../config/passport";

export const auth = async (req: any, res: any, next: NextFunction) => {
  try {
    // Get token from header
    const token = req.header("x-auth-token");

    // Check if not token
    if (!token)
      return res.status(401).json({ msg: "No token, authorization denied" });

    // Verify Token
    jwt.verify(token, jwtSecret, (error: any, decoded: any) => {
      if (error) {
        return res.status(401).json({ msg: "Token is not valid" });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (error) {
    console.error("Error in auth middleware: ", error);
    return res.status(401).json({ msg: "Authentication is failed" });
  }
};
