"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleIndex = void 0;
const http_error_1 = require("./http-error");
const path = require("path");
const fs = require("fs/promises");
const simpleIndex = (root) => (req, res, next) => {
    const relativePath = req.params.dir;
    if (!relativePath) {
        throw new http_error_1.HttpError(403, 'Forbidden');
    }
    const fullPath = path.join(root, relativePath);
    fs.readdir(fullPath)
        .then((files) => {
        const content = files.map((f) => `<li>${f}</li>`).join('');
        const html = `<html><body><h1>${fullPath}</h1><ul>${content}</ul></body></html>`;
        res.type('html').status(200).send(html);
    })
        .catch((err) => next(http_error_1.HttpError.from(err, 500)));
};
exports.simpleIndex = simpleIndex;
//# sourceMappingURL=simple-index.js.map