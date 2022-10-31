"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDatabase = exports.loggerMiddleware = exports.getQueryParam = void 0;
const fs = require("fs/promises");
const path = require("path");
const database_1 = require("./database");
/**
 * Obtenir la valeur d'un paramètre query
 *
 * @export
 * @param {express.Request} req
 * @param {string} param
 * @returns {string}
 */
function getQueryParam(req, param) {
    const result = req.query[param];
    if (typeof (result) === 'string') {
        return result;
    }
    if (Array.isArray(result) && typeof (result[0]) === 'string') {
        return result[0];
    }
    return undefined;
}
exports.getQueryParam = getQueryParam;
/**
 * Logger middleware
 *
 * @param {npmLog.Logger} logger
 * @returns {(req: any, res: any, next: any) => void}
 */
const loggerMiddleware = (logger) => ((req, res, next) => {
    const startTime = process.hrtime();
    let diff;
    let statusCode;
    let ev;
    const log = () => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const logMethod = (statusCode && statusCode >= 400 ? logger.error : logger.info)
            .bind(logger);
        logMethod('http', `${statusCode || 0} ${ev} ${req.method} ${req.originalUrl} ${(diff[0] * 1000000000 + diff[1]) / 1000000} ms`);
    };
    res.once('finish', () => {
        diff = process.hrtime(startTime);
        ev = 'finish';
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
exports.loggerMiddleware = loggerMiddleware;
/**
 * Initialisation de la base
 *
 * @export
 * @async
 * @param {string} databasePath
 * @returns {Promise<void>}
 */
async function initDatabase(databasePath) {
    try {
        await fs.stat(databasePath);
    }
    catch {
        const dbdir = path.dirname(databasePath);
        try {
            await fs.stat(dbdir);
        }
        catch {
            await fs.mkdir(dbdir, { recursive: true });
            await fs.stat(dbdir);
        }
    }
    await database_1.Database.exec(databasePath, (async (db) => {
        await db.createTables();
        await db.insertSomeData();
    }));
}
exports.initDatabase = initDatabase;
//# sourceMappingURL=tools.js.map