import { Database } from "jsr:@db/sqlite@0.11";
const db = new Database("./database/notes.db");
// const markdown = Deno.readTextFileSync("./notes/first_note.md");
db.exec(`CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY,
    notes TEXT NOT NULL,
    date DATETIME NOT NULL
)`);
const insertStmt = db.prepare(
  `INSERT INTO notes (id, notes, date) VALUES(?, ?, ?) RETURNING id`,
);

export function insertNotes(id: string, notes: string) {
  const date = new Date().toJSON().slice(0, 10).replace(/-/g, "/");
  return insertStmt.get(id, notes, date);
}
// insertNotes(crypto.randomUUID(), markdown);
