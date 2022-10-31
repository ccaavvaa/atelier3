"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const logger = require("npmlog");
const open = require("open");
const path = require("path");
const tools_1 = require("./tools/tools");
const server_context_1 = require("./tools/server-context");
const persons_controller_1 = require("./controllers/persons-controller");
const documents_router_1 = require("./controllers/documents-router");
const documents_router2_1 = require("./controllers/documents-router2");
// la répértoire racine
const rootAppDir = path.join(__dirname, '..');
// variables globales
const PORT = 5000; // port serveur
const DBPATH = path.join(rootAppDir, 'data/db/badsecdata.db'); // le chemin de la base (exercice 1 et 2)
const DOCPATH = path.join(rootAppDir, 'data/doc'); // le chemin racine des dossier "personnels"
const PUBLIC = path.join(__dirname, '../public'); // le dossier client html
// la fonction de démarrage du serveur
async function startupAppServer() {
    await (0, tools_1.initDatabase)(DBPATH); // initialisation de la base de données
    const app = express(); // création de l'application express
    // initialisation du contexte de l'application
    // le contexte sera mémorisé dans app.locals => accessible dans le traitement des requettes
    (0, server_context_1.setServerContext)(app, {
        databasePath: DBPATH,
        logger,
        docPath: DOCPATH,
    });
    // logger middleware
    app.use((0, tools_1.loggerMiddleware)(logger));
    // les routers express
    app.use('/persons', persons_controller_1.personsRouter);
    app.use('/documents', (0, documents_router_1.documentsRouter)(DOCPATH));
    app.use('/mesDocuments', documents_router_1.mesDocumentsRouter);
    app.use('/mesDocuments2', (0, documents_router2_1.mesDocumentsRouter2)(DOCPATH));
    // le dossier public est publié à la racine du serveur
    app.use('/', express.static(PUBLIC));
    // démarage du serveur
    const srv = http.createServer(app);
    srv.listen(PORT, () => {
        logger.info('server', `Listening on ${PORT}`);
        open(`http://localhost:${PORT}`).catch((err) => logger.error('browser', err instanceof Error ? err.message : err));
    });
}
// démarage de l'application
startupAppServer().catch((err) => console.error(err.message || err));
//# sourceMappingURL=index.js.map