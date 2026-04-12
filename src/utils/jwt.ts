import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import crypto from "node:crypto";
import { env } from '../config/env.js';


type JwtExpiresIn = Exclude<SignOptions['expiresIn'], undefined>;

const accessSecret = env.JWT_ACCESS_TOKEN_SECRET;
const refreshSecret = env.JWT_REFRESH_TOKEN_SECRET;
const accessTokenExpiresIn = env.JWT_ACCESS_TOKEN_EXPIRES_IN as JwtExpiresIn;
const refreshTokenExpiresIn = env.JWT_REFRESH_TOKEN_EXPIRES_IN as JwtExpiresIn;


const generateUserVerificationToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = hashToken(rawToken);
  return { rawToken, hashedToken };
};

const hashToken = (token: string) => {
    return crypto.createHash("sha256").update(token).digest("hex");
}

const generateAccessToken = (payload: object) => {
    const options: SignOptions = { expiresIn: accessTokenExpiresIn || '15m' };
    return jwt.sign(payload, accessSecret, options);
}

const generateRefreshToken = (payload: object) => {
    const options: SignOptions = { expiresIn: refreshTokenExpiresIn || '7d' };
    return jwt.sign(payload, refreshSecret, options);
}

const verifyAccessToken = (token: string) => {
    try {
        return jwt.verify(token, accessSecret) as { id: number };
    } catch (error) {
        return null;
    }
}

const verifyRefreshToken = (token: string) => {
    try {
        return jwt.verify(token, refreshSecret) as { id: number };
    } catch (error) {
        return null;
    }
}

export {
    generateAccessToken,
    generateRefreshToken,
    generateUserVerificationToken,
    hashToken,
    verifyAccessToken,
    verifyRefreshToken,
}
