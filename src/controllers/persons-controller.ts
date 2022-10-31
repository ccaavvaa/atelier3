import express = require('express');
import { Database } from '../tools/database';
import { errorMiddleware } from '../tools/json-error-middleware';
import { getServerContext } from '../tools/server-context';
import { getQueryParam } from '../tools/tools';

interface Person {
    lastName: string;
    firstName: string;
    age: number;
    photoUrl: string;
}
export const personsRouter = express.Router()
    .post('/', express.json(), (req, res, next) => {
        const { databasePath } = getServerContext(req);
        Database.exec(databasePath, async (db) => {
            const person = await createPerson(db, req.body);
            const debugMessage = `Person created in ${databasePath}`;
            const data: [Person, string] = [person, debugMessage];
            return { data, statusCode: 201 };
        }).then(({ data, statusCode }) => res
            .status(statusCode)
            .send(data)
        ).catch((error) =>
            next(error)
        );
    })
    .get('/', express.json(), (req, res, next) => {
        const nameHint = getQueryParam(req, 'search');
        const { databasePath } = getServerContext(req);
        Database.exec(databasePath, async (db) => {
            const persons = await getPersons(db, nameHint);
            return { data: persons, statusCode: 200 };
        }).then(({ data, statusCode }) => res
            .status(statusCode)
            .send(data)
        ).catch((error) =>
            next(error)
        );
    })
    .get('/:name/fiche', (req, res, next) => {
        const name = req.params.name;
        const { databasePath } = getServerContext(req);
        Database.exec(databasePath, async (db) => {
            const fiche = await getFiche(db, name);
            return { data: fiche, statusCode: 200 };
        }).then(({ data, statusCode }) => res
            .type('html')
            .status(statusCode)
            .send(data)
        ).catch((error) =>
            next(error)
        );
    })
    .use(errorMiddleware);

async function createPerson(db: Database, data: any) {
    const person: Person = {
        firstName: data.firstName,
        lastName: data.lastName,
        age: data.age,
        photoUrl: data.photoUrl,
    }
    const statements: string[] = [
        `INSERT INTO PERSONNES(nom, prenom, age) VALUES ('${person.lastName}', '${person.firstName}', ${person.age})`,
    ];
    if (data.photoUrl) {
        statements.push(`INSERT INTO PHOTOS (nom, url) VALUES ('${person.lastName}', '${person.photoUrl}')`);
    }
    await db.runScript(statements);
    return person;
}

async function getPersons(db: Database, nameHint: string, exactMatch = false): Promise<Person[]> {
    let sql = 'SELECT P.nom, P.prenom, P.age, I.url FROM PERSONNES P LEFT JOIN PHOTOS I ON I.nom=P.nom'
    if (nameHint) {
        const where = exactMatch ? `P.nom='${nameHint}'` : `P.nom LIKE '%${nameHint}%'`
        sql += ` WHERE ${where}`;
    }
    const data = await db.select(sql);
    const persons: Person[] = data.map((v) => ({
        firstName: v.prenom,
        lastName: v.nom,
        age: v.age,
        photoUrl: v.url,
    }));

    return persons;
}

async function getFiche(db: Database, name: string) {
    const persons = await getPersons(db, name, true);
    const person = persons && persons.length ? persons[0] : null;
    let body: string;
    if (person) {
        const img = person.photoUrl ?
            `<img src="${person.photoUrl}" />` : '';
        body = [
            `<h1>${person.firstName} ${person.lastName}</h1>`,
            `<p>Age: ${person.age.toFixed(0)}</p>`,
            img
        ].join('\n');
    } else {
        body = `<h1>${name} ne fait pas partie de notre annuaire</h1>`;
    }
    const html = [
        '<html>',
        '<body>',
        body,
        '</body>',
        '</html>'
    ].join('\n');
    return html;
}
