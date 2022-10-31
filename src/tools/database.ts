import * as sqlite3 from 'sqlite3';
/**
 * Classe outils pour utiliser des promises pour sqlite
 *
 * @export
 * @class Database
 * @typedef {Database}
 */
export class Database {
    /**
     * Exécute une fonction f asynchrone dans le context d'une connexion à la base de données
     * @public
     * @static
     * @async
     * @template T = void
     * @param {string} databasePath
     * @param {(database: Database) => Promise<T>} f
     * @returns {Promise<T>}
     */
    public static async exec<T = void>(databasePath: string, f: (database: Database) => Promise<T>): Promise<T> {
        const db = new Database(databasePath);
        try {
            await db.open();
            return await f(db);
        } finally {
            await db.close();
        }
    }
    /**
     * sqlite3 database
     *
     * @private
     * @type {sqlite3.Database}
     */
    private sqlite: sqlite3.Database;

    /**
     * Chemin de la base de données
     *
     * @public
     * @readonly
     * @type {string}
     */
    public readonly databasePath: string;

    /**
     * Creates an instance of Database.
     *
     * @constructor
     * @param {string} databasePath
     */
    constructor(databasePath: string) {
        this.databasePath = databasePath;
    }

    /**
     * Execute sql
     *
     * @public
     * @param {string} sql
     * @param {...any[]} params
     * @returns {Promise<sqlite3.RunResult>}
     */
    public run(sql: string, ...params: any[]): Promise<sqlite3.RunResult> {
        return new Promise<sqlite3.RunResult>((resolve, reject) => {
            if (!this.sqlite) {
                reject(new Error('Database is closed'));
            }
            const callback = function (this: sqlite3.RunResult, err: Error | null) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this);
                }
            }
            params = [...params, callback]
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            this.sqlite.run(sql, ...params);
        });
    }

    /**
     * Execute query sql
     *
     * @public
     * @async
     * @param {string} sql
     * @param {...any[]} params
     * @returns {Promise<any[]>}
     */
    public async select(sql: string, ...params: any[]): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            if (!this.sqlite) {
                reject(new Error('Database is closed'));
                return;
            }
            const callback: (this: sqlite3.Statement, err: Error | null, rows: any[]) => void = (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            }

            params = [...params, callback];
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            this.sqlite.all(sql, ...params);
        })
    }

    /**
     * Open database
     *
     * @public
     * @async
     * @returns {Promise<void>}
     */
    public async open(): Promise<void> {
        if (this.sqlite) {
            return;
        }
        await new Promise<void>((resolve, reject) => {
            this.sqlite = new sqlite3.Database(this.databasePath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
    /**
     * Close database
     *
     * @public
     * @async
     * @returns {Promise<void>}
     */
    public async close(): Promise<void> {
        if (!this.sqlite) {
            return;
        }
        await new Promise<void>((resolve, reject) => {
            this.sqlite.close((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        this.sqlite = null;
    }


    /**
     * Description placeholder
     *
     * @public
     * @async
     * @returns {Promise<void>}
     */
    public async createTables(): Promise<void> {
        const statements: string[] = [
            'DROP TABLE IF EXISTS PERSONNES',
            'CREATE TABLE PERSONNES (nom VARCHAR(32), prenom VARCHAR(32), age INT)',
            'DROP TABLE IF EXISTS PHOTOS',
            'CREATE TABLE PHOTOS (nom VARCHAR(32), url VARCHAR(32))',
            'DROP TABLE IF EXISTS CONTRATS',
            'CREATE TABLE CONTRATS (entreprise VARCHAR(32), sujet VARCHAR(32), montant INT)',
            'DROP TABLE IF EXISTS USERS',
            'CREATE TABLE USERS (login VARCHAR(32), hash VARCHAR(32))',
        ];
        await this.runScript(statements);
    }
    /**
     * Description placeholder
     *
     * @public
     * @async
     * @returns {Promise<void>}
     */
    public async insertSomeData(): Promise<void> {
        const statements: { sql: string, params?: any[] }[] = [
            { sql: 'INSERT INTO PERSONNES (nom, prenom, age) VALUES (?,?,?)', params: ['Lagaffe', 'Gaston', 63] },
            { sql: 'INSERT INTO PERSONNES (nom, prenom, age) VALUES (?,?,?)', params: ['Doe', 'John', 25] },
            { sql: 'INSERT INTO PHOTOS (nom, url) VALUES (?,?)', params: ['Lagaffe', '/img/person.png'] },
            { sql: 'INSERT INTO PHOTOS (nom, url) VALUES (?,?)', params: ['Doe', '/img/person2.png'] },
            { sql: 'INSERT INTO CONTRATS (entreprise, sujet, montant) VALUES (?,?,?)', params: ['Ministère', 'Contrat ultra-secret', 1000000] },

        ];
        await this.runScript(statements);
    }

    /**
     * Execute plusieurs commandes sql
     *
     * @public
     * @async
     * @param {(({ sql: string, params?: any[] } | string)[])} statements
     * @returns {Promise<void>}
     */
    public async runScript(statements: ({ sql: string, params?: any[] } | string)[]): Promise<void> {
        for (let statement of statements) {
            if (typeof (statement) === 'string') {
                statement = { sql: statement };
            }
            await this.run(statement.sql, statement.params);
        }
    }
}
