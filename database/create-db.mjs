import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

const dir = path.resolve('database');
const dbPath = path.join(dir, 'vamoa.db');
const schemaPath = path.join(dir, 'schema.sql');

fs.mkdirSync(dir, { recursive: true });

const db = new DatabaseSync(dbPath);
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema);

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name").all();
console.log('Banco criado em:', dbPath);
console.log('Tabelas:', tables);

const totalViagens = db.prepare('SELECT COUNT(*) AS total FROM viagens').get();
console.log('Viagens cadastradas:', totalViagens.total);

db.close();
