import type { Response } from 'express';

export function sendSuccess(res: Response, data: unknown, message = 'Success') {
  return res.status(200).json({ status: 'success', message, data });
}

export function sendError(res: Response, message = 'Error', statusCode = 500) {
  return res.status(statusCode).json({ status: 'error', message });
}
