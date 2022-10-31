"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mesDocumentsRouter2 = void 0;
const express = require("express");
const simple_index_1 = require("../tools/simple-index");
const mesDocumentsRouter2 = (docPath) => express.Router()
    .get('/:dir', (0, simple_index_1.simpleIndex)(docPath))
    .get('/', (req, res) => {
    // l'authéntification n'est pas gérée le code du client est initialisé par code
    // c'est un exemple, il faut impléménter une authentification réele
    const customerCode = '00000032';
    const customerName = 'SALVIA';
    const customerAgent = 'F. Martin';
    // la page est généré dinamiquement
    let p = req.baseUrl;
    if (!p.endsWith('/')) {
        p += '/';
    }
    p += customerCode;
    const result = `<html><body>
                <h1>Bienvenue ${customerName}</h1>
                <h3>Votre correspondant: ${customerAgent}</h3>
                <h3>Vos documents</h3>
                <iframe src="${p}" width='100%' height='100%' frameborder='0'/>
                </body></html>`;
    res
        .type('html')
        .status(200)
        .send(result);
});
exports.mesDocumentsRouter2 = mesDocumentsRouter2;
//# sourceMappingURL=documents-router2.js.map