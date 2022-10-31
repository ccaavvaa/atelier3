import { Request, Response, NextFunction } from 'express';
/**
 * error middleware pour des réponses json
 *
 * @param {*} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export declare const errorMiddleware: (err: any, req: Request, res: Response, next: NextFunction) => void;
