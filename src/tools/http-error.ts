/**
 * Erreur http avec status et message
 *
 * @export
 * @class HttpError
 * @typedef {HttpError}
 * @extends {Error}
 */
export class HttpError extends Error{
    /**
     * status http
     *
     * @public
     * @readonly
     * @type {number}
     */
    public readonly status: number;
    /**
     * construction d'une erreur http à partir d'une exception
     *
     * @public
     * @static
     * @param {Error} error
     * @param {number} status
     * @returns {HttpError}
     */
    public static from(error: Error, status: number): HttpError {
        return new HttpError(status, error.message);
    }
    /**
     * Creates an instance of HttpError.
     *
     * @constructor
     * @param {number} status
     * @param {?string} [message]
     */
    constructor (status: number, message?: string){
        super(message);
        this.status = status;
    }
}