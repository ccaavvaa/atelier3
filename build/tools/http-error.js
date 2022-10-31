"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
/**
 * Erreur http avec status et message
 *
 * @export
 * @class HttpError
 * @typedef {HttpError}
 * @extends {Error}
 */
class HttpError extends Error {
    /**
     * Creates an instance of HttpError.
     *
     * @constructor
     * @param {number} status
     * @param {?string} [message]
     */
    constructor(status, message) {
        super(message);
        this.status = status;
    }
    /**
     * construction d'une erreur http à partir d'une exception
     *
     * @public
     * @static
     * @param {Error} error
     * @param {number} status
     * @returns {HttpError}
     */
    static from(error, status) {
        return new HttpError(status, error.message);
    }
}
exports.HttpError = HttpError;
//# sourceMappingURL=http-error.js.map