import type { Request, Response, NextFunction } from "express";
import { login, logout, register, verifyEmail, getUserData, refresh } from "./auth.service.js";
import { sendSuccess } from "../../utils/response.js"

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await register(req.body);
        return sendSuccess(res, result);
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await login(req.body);
        return sendSuccess(res, result);
    } catch (error) {
        next(error);
    }
};

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, token } = req.body;
        const result = await verifyEmail(userId, token);
        return sendSuccess(res, result);
    } catch (error) {
        next(error);
    }
};

export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId!;
        await logout(userId);
        return sendSuccess(res, null, "Logged out successfully");
    } catch (error) {
        next(error);
    }
}

export const userProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId!;
        const userData = await getUserData(userId);
        return sendSuccess(res, userData);
    } catch (error) {
        next(error);
    }
}

export const sessionRefresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.headers['x-refresh-token'] as string;
        const result = await refresh(refreshToken);
        return sendSuccess(res, result, "Session refreshed successfully");
    }
    catch (error) {
        next(error);
    }
}
