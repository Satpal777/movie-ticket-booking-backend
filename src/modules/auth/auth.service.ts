import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { LoginDtoType, RegisterDtoType } from "./auth.dto.js";
import { tokens, users } from "./auth.schema.js";
import { AppError } from "../../utils/errors.js";
import { createHmac, randomBytes } from "node:crypto";
import { generateAccessToken, generateRefreshToken, generateUserVerificationToken, hashToken, verifyRefreshToken } from "../../utils/jwt.js";
import { sendVerificationEmail } from "../../email/node-mailer.js";

export const register = async ({ email, password, name }: RegisterDtoType) => {

    const conflictingRecords = await db.select().from(users).where(eq(users.email, email));
    if (conflictingRecords.length > 0) {
        throw AppError.conflict("Email already exists");
    }

    const salt = randomBytes(32).toString("hex");
    const hash = createHmac("sha256", salt).update(password).digest("hex");

    const [userResult] = await db.insert(users).values({
        name,
        email,
        password: hash,
        salt,
    }).returning({ id: users.id });

    if (!userResult) {
        throw AppError.internal("Failed to create user");
    }

    const { rawToken, hashedToken } = generateUserVerificationToken();

    const [tokenResult] = await db.insert(tokens).values({
        userId: userResult.id,
        verifyToken: hashedToken,
        verifyExpiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    }).returning({ id: tokens.id });

    if (!tokenResult) {
        throw AppError.internal("Failed to create user");
    }

    try {
        await sendVerificationEmail(email, userResult.id, rawToken);
    } catch (err) {
        console.error("Failed to send verification email:", err);
    }

    return {
        userId: userResult.id,
    };

};

export const verifyEmail = async (userId: number, token: string) => {
    console.log(userId, token)
    const [tokenResult] = await db.select().from(tokens).where(eq(tokens.userId, userId));

    if (!tokenResult) {
        throw AppError.notFound();
    }

    if (!tokenResult.verifyExpiredAt || tokenResult.verifyExpiredAt < new Date()) {
        throw AppError.badRequest("Token expired");
    }

    const hashedToken = hashToken(token);
    if (tokenResult.verifyToken !== hashedToken) {
        throw AppError.badRequest("Invalid token");
    }

    await db.update(users).set({ isVerified: true }).where(eq(users.id, userId));
    await db.update(tokens).set({ verifyToken: null, verifyExpiredAt: null }).where(eq(tokens.userId, userId));
};

export const login = async ({ email, password }: LoginDtoType) => {

    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
        throw AppError.unauthorized("Invalid credentials");
    }

    const salt = user.salt;
    const hash = createHmac("sha256", salt).update(password).digest("hex");
    if (hash !== user.password) {
        throw AppError.unauthorized("Invalid credentials");
    }

    if (!user.isVerified) {
        throw AppError.unauthorized("Email not verified");
    }

    const accessToken = generateAccessToken({ id: user.id });
    const refreshToken = generateRefreshToken({ id: user.id });

    await db.update(tokens).set({ refreshToken: hashToken(refreshToken) }).where(eq(tokens.userId, user.id));

    return {
        email: user.email,
        name: user.name,
        accessToken,
        refreshToken,
    };
};

export const logout = async (userId: number) => {
    await db.update(tokens).set({ refreshToken: null }).where(eq(tokens.userId, userId));
};

export const getUserData = async (userId: number) => {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
        throw AppError.notFound();
    }

    return {
        email: user.email,
        name: user.name,
    };
};

export const refresh = async (token: string) => {
    if (!token) throw AppError.unauthorized("Refresh token missing");
    
    const decoded = verifyRefreshToken(token);
    if (!decoded) {
        throw AppError.unauthorized("Invalid refresh token")
    };

    const [tokenRecord] = await db.select().from(tokens).where(eq(tokens.userId, decoded.id));
    if (!tokenRecord) throw AppError.unauthorized("User not found");

    if (tokenRecord.refreshToken !== hashToken(token)) {
        throw AppError.unauthorized("Invalid refresh token");
    }

    const accessToken = generateAccessToken({ id: tokenRecord.userId });
    const refreshToken = generateRefreshToken({ id: tokenRecord.userId });

    await db.update(tokens).set({ refreshToken: hashToken(refreshToken) }).where(eq(tokens.userId, tokenRecord.userId));

    return { accessToken, refreshToken };
};