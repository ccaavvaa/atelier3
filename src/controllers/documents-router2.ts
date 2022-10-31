import * as express from 'express'
import { simpleIndex } from '../tools/simple-index';


export const mesDocumentsRouter2 = (docPath: string) =>
    express.Router()
        .get('/:dir', simpleIndex(docPath))
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
