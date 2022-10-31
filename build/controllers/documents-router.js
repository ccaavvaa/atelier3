"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mesDocumentsRouter = exports.documentsRouter = void 0;
const express = require("express");
const _path = require("path");
const serveIndex = require("serve-index");
// pour bloquer la navigation vers le dossier parent
// la fonction de génération de l'index est remplacée avec une qui ignore le paramètre showUp
const originalServeIndexHtml = serveIndex.html;
serveIndex.html = (req, res, files, next, dir, showUp, icons, path, view, template, stylesheet) => {
    originalServeIndexHtml(req, res, files, next, dir, false, icons, path, view, template, stylesheet);
};
const documentsRouter = (docPath) => express.Router()
    .use(express.static(docPath), serveIndex(docPath, {
    icons: true,
    template: _path.join(__dirname, '../../res/directory.html'), // template qui ne permet pas la navigation
}));
exports.documentsRouter = documentsRouter;
exports.mesDocumentsRouter = express.Router()
    // .use('/documents', serveIndex(docPath))
    .get('/', (req, res) => {
    // l'authéntification n'est pas gérée le code du client est initialisé par code
    // c'est un exemple, il faut impléménter une authentification réele
    const customerCode = '00000032';
    const customerName = 'SALVIA';
    const customerAgent = 'F. Martin';
    // la page est généré dinamiquement
    const result = `<html><body>
        <h1>Bienvenue ${customerName}</h1>
        <h3>Votre correspondant: ${customerAgent}</h3>
        <h3>Vos documents</h3>
        <iframe src="./documents/${customerCode}" width='100%' height='100%' frameborder='0'/>
        </body></html>`;
    res
        .type('html')
        .status(200)
        .send(result);
});
//# sourceMappingURL=documents-router.js.map