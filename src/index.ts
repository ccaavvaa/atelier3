import * as express from 'express';
import * as http from 'http';
import * as logger from 'npmlog';
import * as open from 'open';
import * as path from 'path';

import { initDatabase, loggerMiddleware } from './tools/tools';
import { setServerContext } from './tools/server-context';

import { personsRouter } from './controllers/persons-controller';


import { documentsRouter, mesDocumentsRouter } from './controllers/documents-router';
import { mesDocumentsRouter2 } from './controllers/documents-router2';
// la répértoire racine
const rootAppDir = path.join(__dirname, '..');

// variables globales
const PORT = 5000; // port serveur
const DBPATH = path.join(rootAppDir, 'data/db/badsecdata.db'); // le chemin de la base (exercice 1 et 2)
const DOCPATH = path.join(rootAppDir, 'data/doc'); // le chemin racine des dossier "personnels"
const PUBLIC = path.join(__dirname, '../public'); // le dossier client html

// la fonction de démarrage du serveur
async function startupAppServer() {
    await initDatabase(DBPATH); // initialisation de la base de données
    const app = express(); // création de l'application express

    // initialisation du contexte de l'application
    // le contexte sera mémorisé dans app.locals => accessible dans le traitement des requettes
    setServerContext(app, {
        databasePath: DBPATH,
        logger,
        docPath: DOCPATH,
    });
    // logger middleware
    app.use(loggerMiddleware(logger));

    // les routers express
    app.use('/persons', personsRouter);
    app.use('/documents', documentsRouter(DOCPATH))
    app.use('/mesDocuments', mesDocumentsRouter);
    app.use('/mesDocuments2', mesDocumentsRouter2(DOCPATH));

    // le dossier public est publié à la racine du serveur
    app.use('/', express.static(PUBLIC));

    // démarage du serveur
    const srv = http.createServer(app);
    srv.listen(PORT, () => {
        logger.info('server', `Listening on ${PORT}`);
        open(`http://localhost:${PORT}`).catch((err: Error | string) => logger.error('browser', err instanceof Error ? err.message : err));
    });
}

// démarage de l'application
startupAppServer().catch((err) => console.error(err.message || err));
