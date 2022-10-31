"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.personsRouter = void 0;
const express = require("express");
const database_1 = require("../tools/database");
const json_error_middleware_1 = require("../tools/json-error-middleware");
const server_context_1 = require("../tools/server-context");
const tools_1 = require("../tools/tools");
exports.personsRouter = express.Router()
    .post('/', express.json(), (req, res, next) => {
    const { databasePath } = (0, server_context_1.getServerContext)(req);
    database_1.Database.exec(databasePath, async (db) => {
        const person = await createPerson(db, req.body);
        const debugMessage = `Person created in ${databasePath}`;
        const data = [person, debugMessage];
        return { data, statusCode: 201 };
    }).then(({ data, statusCode }) => res
        .status(statusCode)
        .send(data)).catch((error) => next(error));
})
    .get('/', express.json(), (req, res, next) => {
    const nameHint = (0, tools_1.getQueryParam)(req, 'search');
    const { databasePath } = (0, server_context_1.getServerContext)(req);
    database_1.Database.exec(databasePath, async (db) => {
        const persons = await getPersons(db, nameHint);
        return { data: persons, statusCode: 200 };
    }).then(({ data, statusCode }) => res
        .status(statusCode)
        .send(data)).catch((error) => next(error));
})
    .get('/:name/fiche', (req, res, next) => {
    const name = req.params.name;
    const { databasePath } = (0, server_context_1.getServerContext)(req);
    database_1.Database.exec(databasePath, async (db) => {
        const fiche = await getFiche(db, name);
        return { data: fiche, statusCode: 200 };
    }).then(({ data, statusCode }) => res
        .type('html')
        .status(statusCode)
        .send(data)).catch((error) => next(error));
})
    .use(json_error_middleware_1.errorMiddleware);
async function createPerson(db, data) {
    const person = {
        firstName: data.firstName,
        lastName: data.lastName,
        age: data.age,
        photoUrl: data.photoUrl,
    };
    const statements = [
        `INSERT INTO PERSONNES(nom, prenom, age) VALUES ('${person.lastName}', '${person.firstName}', ${person.age})`,
    ];
    if (data.photoUrl) {
        statements.push(`INSERT INTO PHOTOS (nom, url) VALUES ('${person.lastName}', '${person.photoUrl}')`);
    }
    await db.runScript(statements);
    return person;
}
async function getPersons(db, nameHint, exactMatch = false) {
    let sql = 'SELECT P.nom, P.prenom, P.age, I.url FROM PERSONNES P LEFT JOIN PHOTOS I ON I.nom=P.nom';
    if (nameHint) {
        const where = exactMatch ? `P.nom='${nameHint}'` : `P.nom LIKE '%${nameHint}%'`;
        sql += ` WHERE ${where}`;
    }
    const data = await db.select(sql);
    const persons = data.map((v) => ({
        firstName: v.prenom,
        lastName: v.nom,
        age: v.age,
        photoUrl: v.url,
    }));
    return persons;
}
async function getFiche(db, name) {
    const persons = await getPersons(db, name, true);
    const person = persons && persons.length ? persons[0] : null;
    let body;
    if (person) {
        const img = person.photoUrl ?
            `<img src="${person.photoUrl}" />` : '';
        body = [
            `<h1>${person.firstName} ${person.lastName}</h1>`,
            `<p>Age: ${person.age.toFixed(0)}</p>`,
            img
        ].join('\n');
    }
    else {
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
//# sourceMappingURL=persons-controller.js.map