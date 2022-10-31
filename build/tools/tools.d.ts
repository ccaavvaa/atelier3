import express = require('express');
import * as npmLog from 'npmlog';
/**
 * Obtenir la valeur d'un paramètre query
 *
 * @export
 * @param {express.Request} req
 * @param {string} param
 * @returns {string}
 */
export declare function getQueryParam(req: express.Request, param: string): string;
/**
 * Logger middleware
 *
 * @param {npmLog.Logger} logger
 * @returns {(req: any, res: any, next: any) => void}
 */
export declare const loggerMiddleware: (logger: npmLog.Logger) => (req: express.Request, res: express.Response, next: express.NextFunction) => void;
/**
 * Initialisation de la base
 *
 * @export
 * @async
 * @param {string} databasePath
 * @returns {Promise<void>}
 */
export declare function initDatabase(databasePath: string): Promise<void>;
