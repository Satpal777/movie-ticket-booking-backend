import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { LoginDto, RegisterDto, VerifyEmailDto } from "./auth.dto.js";
import { authMiddleware, isAuthenticated } from "./auth.middleware.js";
import { userProfile, loginUser, registerUser, verifyUser } from "./auth.controller.js";


const router: ExpressRouter = Router();

router.post("/register", authMiddleware, validate(RegisterDto), registerUser);
router.post("/login", authMiddleware, validate(LoginDto), loginUser);
router.post('/verify-email', authMiddleware,validate(VerifyEmailDto), verifyUser);
router.get("/me", authMiddleware, isAuthenticated, userProfile);
router.get('/refresh',authMiddleware,isAuthenticated,sessionRefresh);

export default router;