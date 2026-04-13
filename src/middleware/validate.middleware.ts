import type { Request, Response, NextFunction } from 'express';
import BaseDto from '../utils/base.dto.js';
import { AppError } from '../utils/errors.js';

export const validate = function (DTOClass: typeof BaseDto) {
    return (req: Request, res: Response, next: NextFunction) => {
        const { errors, value } = DTOClass.validate(req.body);
        if (errors) {
            throw AppError.badRequest(errors.toString());
        }
        req.body = value;
        next();
    };
};

export const validateParams = function (DTOClass: typeof BaseDto) {
    return (req: Request, res: Response, next: NextFunction) => {
        const { errors, value } = DTOClass.validate(req.params as any);
        if (errors) {
            throw AppError.badRequest(errors.toString());
        }
        Object.assign(req.params, value);
        next();
    };
};

