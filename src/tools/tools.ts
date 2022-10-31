import express = require('express');
import * as npmLog from 'npmlog';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Database } from './database';


/**
 * Obtenir la valeur d'un paramètre query
 *
 * @export
 * @param {express.Request} req
 * @param {string} param
 * @returns {string}
 */
export function getQueryParam(req: express.Request, param: string): string {
    const result = req.query[param];
    if (typeof (result) === 'string') {
        return result;
    }
    if (Array.isArray(result) && typeof (result[0]) === 'string') {
        return result[0];
    }
    return undefined;
}

/**
 * Logger middleware
 *
 * @param {npmLog.Logger} logger
 * @returns {(req: any, res: any, next: any) => void}
 */
export const loggerMiddleware = (logger: npmLog.Logger) => (
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const startTime = process.hrtime();
        let diff: [number, number];
        let statusCode: number;
        let ev: 'close' | 'finish';

        const log = () => {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            const logMethod = (statusCode && statusCode >= 400 ? logger.error : logger.info)
                .bind(logger);
            logMethod('http', `${statusCode || 0} ${ev} ${req.method} ${req.originalUrl} ${(diff[0] * 1000000000 + diff[1]) / 1000000} ms`);
        }
        res.once('finish', () => {
            diff = process.hrtime(startTime);
            ev = 'finish'
            statusCode = res.statusCode;
            res.locals.finished = true;
            log();
        });
        res.once('close', () => {
            if (!res.locals.finished) {
                diff = process.hrtime(startTime);
                ev = 'close';
                statusCode = res.statusCode;
                log();
            }
        });
        next();
    });

/**
 * Initialisation de la base
 *
 * @export
 * @async
 * @param {string} databasePath
 * @returns {Promise<void>}
 */
export async function initDatabase(databasePath: string): Promise<void> {
    try {
        await fs.stat(databasePath);
    } catch {
        const dbdir = path.dirname(databasePath);
        try {
            await fs.stat(dbdir);
        } catch {
            await fs.mkdir(dbdir, { recursive: true });
            await fs.stat(dbdir);
        }
    }
    await Database.exec(databasePath, (async (db) => {
        await db.createTables();
        await db.insertSomeData();
    }));
}

