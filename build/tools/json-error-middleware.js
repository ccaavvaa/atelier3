"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const http_error_1 = require("./http-error");
/**
 * error middleware pour des réponses json
 *
 * @param {*} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const errorMiddleware = (err, req, res, next) => {
    if (res.headersSent) {
        next(err);
        return;
    }
    if (!err) {
        next();
    }
    let r;
    if (err instanceof http_error_1.HttpError) {
        const { status, message } = err;
        r = { status, message };
    }
    else {
        r = { status: 500, message: err.message || err };
    }
    res.type('json').status(r.status).send(r);
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=json-error-middleware.js.map