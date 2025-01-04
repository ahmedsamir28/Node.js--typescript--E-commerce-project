import jwt from "jsonwebtoken";

export const createToken = (payload: string): string => {
    return jwt.sign({ id: payload }, process.env.JWT_SECRET || "your-secret-key", {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });
};