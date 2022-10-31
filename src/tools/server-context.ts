import * as npmLog from 'npmlog';
import * as express from 'express';
export interface ServerContext {
    databasePath: string; // chemin de la base de données
    logger: npmLog.Logger; // logger
    docPath: string; // chemin des dossiers personnels
}

export function getServerContext(req: express.Request) {
    return req.app.locals.serverContext as ServerContext;
}

export function setServerContext(app: express.Application, context: ServerContext) {
    app.locals.serverContext = context;
}

