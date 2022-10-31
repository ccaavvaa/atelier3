import * as express from 'express'
import * as _path from 'path';
import * as serveIndex from 'serve-index';

// pour bloquer la navigation vers le dossier parent
// la fonction de génération de l'index est remplacée avec une qui ignore le paramètre showUp
const originalServeIndexHtml = (serveIndex as any).html;
(serveIndex as any).html = (req:any, res:any, files:any, next:any, dir:any, showUp:any, icons:any, path:any, view:any, template:any, stylesheet:any) =>{
    originalServeIndexHtml(req, res, files, next, dir, false, icons, path, view, template, stylesheet)
}
export const documentsRouter = (docPath: string) =>
    express.Router()
        .use(express.static(docPath), serveIndex(docPath, {
            icons: true,
            template: _path.join(__dirname, '../../res/directory.html'), // template qui ne permet pas la navigation
        }));

export const mesDocumentsRouter = express.Router()
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
