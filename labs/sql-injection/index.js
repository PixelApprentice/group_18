const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Initialize SQLite DB
const DBSOURCE = process.env.DB_FILE || ':memory:';
const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, email TEXT, password TEXT)`);
    db.run(`DELETE FROM users`);
    const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
    stmt.run('alice', 'alice@example.com', 'alicepass');
    stmt.run('bob', 'bob@example.com', 'bobpass');
    stmt.run('admin', 'admin@example.com', 'supersecret');
    stmt.finalize();
  });
});

app.get('/', (req, res) => {
  res.render('index', { results: null, query: '' });
});

// Vulnerable search endpoint (string interpolation)
app.get('/search', (req, res) => {
  const q = req.query.q || '';
  // INTENTIONALLY VULNERABLE: do not use string interpolation in production
  const sql = `SELECT id, username, email FROM users WHERE username LIKE '%${q}%' OR email LIKE '%${q}%'`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).send('Database error');
    }
    // heuristics and warnings:
    // - if user supplied an obvious tautology payload show success
    // - if user submitted a fragment with an unmatched quote warn them to close it
    const hasTautology = /'\s*OR\s*'1'\s*=\s*'1/i.test(q) || /"\s*OR\s*"1"\s*=\s*"1/i.test(q);
    const unmatchedQuote = ((q.match(/'/g) || []).length % 2 !== 0) || ((q.match(/"/g) || []).length % 2 !== 0);
    const success = rows && rows.length >= 3 && hasTautology;
    const warning = unmatchedQuote ? 'It looks like your input has an unmatched quote — try closing quotes in your payload.' : null;
    res.render('index', { results: rows, query: q, success, warning });
  });
});

// Simple ping endpoint
app.get('/health', (req, res) => res.send('ok'));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`SQLi lab listening on ${port}`));
