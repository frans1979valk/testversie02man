import { Observable } from '@nativescript/core';
import { ErrorHandlingService } from './error-handling.service';

interface DatabaseConfig {
    name: string;
    version: number;
    tables: TableConfig[];
}

interface TableConfig {
    name: string;
    columns: ColumnConfig[];
    indexes?: IndexConfig[];
}

interface ColumnConfig {
    name: string;
    type: string;
    primaryKey?: boolean;
    autoIncrement?: boolean;
    notNull?: boolean;
    unique?: boolean;
    default?: any;
}

interface IndexConfig {
    name: string;
    columns: string[];
    unique?: boolean;
}

export class DatabaseService extends Observable {
    private static instance: DatabaseService;
    private _db: any = null;
    private _config: DatabaseConfig = {
        name: 'vip_installatie.db',
        version: 1,
        tables: [
            {
                name: 'users',
                columns: [
                    { name: 'id', type: 'INTEGER', primaryKey: true, autoIncrement: true },
                    { name: 'name', type: 'TEXT', notNull: true },
                    { name: 'email', type: 'TEXT', unique: true },
                    { name: 'phone', type: 'TEXT' },
                    { name: 'vip_level', type: 'INTEGER', default: 1 },
                    { name: 'created_at', type: 'DATETIME', default: 'CURRENT_TIMESTAMP' }
                ],
                indexes: [
                    { name: 'idx_users_email', columns: ['email'], unique: true }
                ]
            },
            {
                name: 'calls',
                columns: [
                    { name: 'id', type: 'INTEGER', primaryKey: true, autoIncrement: true },
                    { name: 'user_id', type: 'INTEGER', notNull: true },
                    { name: 'number', type: 'TEXT', notNull: true },
                    { name: 'duration', type: 'INTEGER' },
                    { name: 'started_at', type: 'DATETIME', default: 'CURRENT_TIMESTAMP' }
                ],
                indexes: [
                    { name: 'idx_calls_user', columns: ['user_id'] }
                ]
            },
            {
                name: 'messages',
                columns: [
                    { name: 'id', type: 'INTEGER', primaryKey: true, autoIncrement: true },
                    { name: 'user_id', type: 'INTEGER', notNull: true },
                    { name: 'number', type: 'TEXT', notNull: true },
                    { name: 'message', type: 'TEXT', notNull: true },
                    { name: 'sent_at', type: 'DATETIME', default: 'CURRENT_TIMESTAMP' }
                ],
                indexes: [
                    { name: 'idx_messages_user', columns: ['user_id'] }
                ]
            }
        ]
    };

    private constructor() {
        super();
        this.initialize();
    }

    static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    private async initialize() {
        try {
            const sqlite = require('nativescript-sqlite');
            this._db = await new sqlite(this._config.name);
            
            await this.createTables();
            await this.createIndexes();
            await this.runMigrations();
        } catch (error) {
            ErrorHandlingService.getInstance().handleError(error, {
                title: 'Database Fout',
                message: 'Kan database niet initialiseren',
                isCritical: true
            });
        }
    }

    private async createTables() {
        for (const table of this._config.tables) {
            const columns = table.columns.map(col => {
                let def = `${col.name} ${col.type}`;
                if (col.primaryKey) def += ' PRIMARY KEY';
                if (col.autoIncrement) def += ' AUTOINCREMENT';
                if (col.notNull) def += ' NOT NULL';
                if (col.unique) def += ' UNIQUE';
                if (col.default) def += ` DEFAULT ${col.default}`;
                return def;
            }).join(', ');

            const sql = `CREATE TABLE IF NOT EXISTS ${table.name} (${columns})`;
            await this._db.execSQL(sql);
        }
    }

    private async createIndexes() {
        for (const table of this._config.tables) {
            if (table.indexes) {
                for (const index of table.indexes) {
                    const sql = `CREATE ${index.unique ? 'UNIQUE ' : ''}INDEX IF NOT EXISTS ${index.name} 
                                ON ${table.name} (${index.columns.join(', ')})`;
                    await this._db.execSQL(sql);
                }
            }
        }
    }

    private async runMigrations() {
        const currentVersion = await this.getCurrentVersion();
        if (currentVersion < this._config.version) {
            // Voer migraties uit
            await this.migrate(currentVersion, this._config.version);
        }
    }

    private async getCurrentVersion(): Promise<number> {
        try {
            const result = await this._db.get('PRAGMA user_version');
            return result.user_version;
        } catch (error) {
            return 0;
        }
    }

    private async migrate(fromVersion: number, toVersion: number) {
        // Implementeer database migraties hier
        console.log(`Migreren van versie ${fromVersion} naar ${toVersion}`);
    }

    async query(sql: string, params: any[] = []): Promise<any[]> {
        try {
            return await this._db.all(sql, params);
        } catch (error) {
            ErrorHandlingService.getInstance().handleError(error, {
                title: 'Database Query Fout',
                message: 'Kan query niet uitvoeren',
                isCritical: false
            });
            return [];
        }
    }

    async execute(sql: string, params: any[] = []): Promise<boolean> {
        try {
            await this._db.execSQL(sql, params);
            return true;
        } catch (error) {
            ErrorHandlingService.getInstance().handleError(error, {
                title: 'Database Execute Fout',
                message: 'Kan commando niet uitvoeren',
                isCritical: false
            });
            return false;
        }
    }

    async backup(path: string): Promise<boolean> {
        try {
            await this._db.backup(path);
            return true;
        } catch (error) {
            ErrorHandlingService.getInstance().handleError(error, {
                title: 'Database Backup Fout',
                message: 'Kan backup niet maken',
                isCritical: true
            });
            return false;
        }
    }
}