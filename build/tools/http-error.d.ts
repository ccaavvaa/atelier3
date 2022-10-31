/**
 * Erreur http avec status et message
 *
 * @export
 * @class HttpError
 * @typedef {HttpError}
 * @extends {Error}
 */
export declare class HttpError extends Error {
    /**
     * status http
     *
     * @public
     * @readonly
     * @type {number}
     */
    readonly status: number;
    /**
     * construction d'une erreur http à partir d'une exception
     *
     * @public
     * @static
     * @param {Error} error
     * @param {number} status
     * @returns {HttpError}
     */
    static from(error: Error, status: number): HttpError;
    /**
     * Creates an instance of HttpError.
     *
     * @constructor
     * @param {number} status
     * @param {?string} [message]
     */
    constructor(status: number, message?: string);
}
