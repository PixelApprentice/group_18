const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const DBSOURCE = process.env.DB_FILE || ':memory:';
const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, owner TEXT, content TEXT)');
    db.run('DELETE FROM notes');
    const stmt = db.prepare('INSERT INTO notes (owner, content) VALUES (?, ?)');
    stmt.run('alice', 'Alice private note');
    stmt.run('bob', 'Bob private note');
    stmt.run('victim', 'Secret for victim');
    stmt.finalize();
  });
});

app.get('/', (req, res) => {
  db.all('SELECT id, owner, content FROM notes ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).send('DB error');
    res.render('index', { notes: rows });
  });
});

// vulnerable: no owner check
// vulnerable: no owner check
app.get('/note/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT id, owner, content FROM notes WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).send('DB error');
    if (!row) return res.status(404).render('404');
    // for demonstration, consider it a success if the note owner is not 'alice' (i.e., you can view another user's note)
    const success = row.owner && row.owner !== 'alice';
    res.render('note', { note: row, success });
  });
});

app.get('/health', (req, res) => res.send('ok'));

const port = process.env.PORT || 3004;
app.listen(port, () => console.log(`IDOR lab listening on ${port} (DB=${DBSOURCE})`));
