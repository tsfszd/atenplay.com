import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

export type ReviewRow = { id:number; game_slug:string; parent_id:number|null; author:string; body:string; rating:number|null; created_at:string };
const dbPath = process.env.SQLITE_PATH || path.join(process.cwd(), 'data', 'atenplay.sqlite');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.exec(`
CREATE TABLE IF NOT EXISTS reviews (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 game_slug TEXT NOT NULL,
 parent_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
 author TEXT NOT NULL,
 body TEXT NOT NULL,
 rating INTEGER CHECK (rating BETWEEN 1 AND 5 OR rating IS NULL),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_reviews_game ON reviews(game_slug, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_parent ON reviews(parent_id);
`);
export function addReview(gameSlug:string, author:string, body:string, rating:number){ return db.prepare('INSERT INTO reviews (game_slug,author,body,rating) VALUES (?,?,?,?)').run(gameSlug,author,body,rating); }
export function addReply(gameSlug:string,parentId:number,author:string,body:string){ const parent=db.prepare('SELECT id FROM reviews WHERE id=? AND game_slug=?').get(parentId,gameSlug); if(!parent) throw new Error('Review not found'); return db.prepare('INSERT INTO reviews (game_slug,parent_id,author,body,rating) VALUES (?,?,?,?,NULL)').run(gameSlug,parentId,author,body); }
export function getReviews(gameSlug:string){ return db.prepare('SELECT * FROM reviews WHERE game_slug=? ORDER BY created_at DESC,id DESC').all(gameSlug) as ReviewRow[]; }
export function getRatingSummary(gameSlug:string){ const a=db.prepare('SELECT COUNT(*) count, COALESCE(AVG(rating),0) average FROM reviews WHERE game_slug=? AND parent_id IS NULL AND rating IS NOT NULL').get(gameSlug) as {count:number;average:number}; const rows=db.prepare('SELECT rating,COUNT(*) count FROM reviews WHERE game_slug=? AND parent_id IS NULL AND rating IS NOT NULL GROUP BY rating').all(gameSlug) as {rating:number;count:number}[]; const breakdown:Record<number,number>={1:0,2:0,3:0,4:0,5:0}; rows.forEach(r=>breakdown[r.rating]=r.count); return {count:a.count,average:Number(a.average),breakdown}; }
