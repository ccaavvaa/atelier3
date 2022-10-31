import { Request, Response, NextFunction, RequestHandler } from 'express'
import { HttpError } from './http-error';
import * as path from 'path';
import * as fs from 'fs/promises';

export const simpleIndex = (root: string): RequestHandler => (req: Request, res: Response, next: NextFunction) => {
    const relativePath = req.params.dir;
    if (!relativePath) {
        throw new HttpError(403, 'Forbidden');
    }
    const fullPath = path.join(root, relativePath);
    fs.readdir(fullPath)
        .then((files) => {
            const content = files.map((f) => `<li>${f}</li>`).join('');
            const html = `<html><body><h1>${fullPath}</h1><ul>${content}</ul></body></html>`;
            res.type('html').status(200).send(html);
        })
        .catch((err) => next(HttpError.from(err as Error, 500)));
};
