import express from 'express';
import type { Express } from 'express';
import cors from 'cors';
import { API_PREFIX } from '../config/constants.js';
import { default as auth } from '../modules/auth/auth.routes.js';
import { default as movies } from '../modules/movies/movies.routes.js';
import { errorMiddleware } from '../middleware/error.middleware.js';

export function createApplication(): Express {
    const app = express();

    app.use(cors({
        origin: ["https://chainmoj.satpal.cloud"],
        credentials: true
    }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(`${API_PREFIX}/auth`, auth);
    app.use(`${API_PREFIX}/movies`, movies);

    app.get('/health', (req, res) => {
        res.status(200).json({ status: 'success', message: 'Server is healthy' });
    });

    app.use(errorMiddleware);

    return app;
}