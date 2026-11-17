import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('database/vamoa.db');

console.log('--- SELECT com WHERE ---');
const usuarios = db.prepare("SELECT id, nome, email FROM usuarios WHERE email LIKE '%@vamoae.com'").all();
console.log(JSON.stringify(usuarios, null, 2));

console.log('--- UPDATE ---');
const update = db.prepare("UPDATE usuarios SET nome = ? WHERE id = ?").run('Maria Souza Atualizada', 2);
console.log(JSON.stringify({ changes: update.changes }, null, 2));
console.log(JSON.stringify(db.prepare("SELECT id, nome, email FROM usuarios WHERE id = 2").all(), null, 2));

console.log('--- DELETE ---');
const del = db.prepare("DELETE FROM pagamentos WHERE status = ? AND id = ?").run('pendente', 2);
console.log(JSON.stringify({ deleted: del.changes }, null, 2));
console.log(JSON.stringify(db.prepare("SELECT id, reserva_id, status FROM pagamentos ORDER BY id").all(), null, 2));

db.close();
