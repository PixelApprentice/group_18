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
  if (err) throw err;
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY, author TEXT, content TEXT)`);
    db.run(`DELETE FROM comments`);
    const stmt = db.prepare('INSERT INTO comments (author, content) VALUES (?, ?)');
    stmt.run('alice', 'Hello world');
    stmt.run('bob', '<script>console.log("XSS")</script>');
    stmt.finalize();
  });
});

app.get('/', (req, res) => {
  db.all('SELECT id, author, content FROM comments ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).send('DB error');
    // intentionally render content without escaping
    res.render('index', { comments: rows });
  });
});

app.post('/comment', (req, res) => {
  const { author, content } = req.body;
  db.run('INSERT INTO comments (author, content) VALUES (?, ?)', [author || 'guest', content || ''], (err) => {
    if (err) return res.status(500).send('DB error');
    // if the comment contains a script tag, show a success banner
    const success = typeof content === 'string' && /<script[\s\S]*?>[\s\S]*?<\/script>/i.test(content);
    if (success) {
      // render the index with success flag (so students see immediate feedback)
      db.all('SELECT id, author, content FROM comments ORDER BY id DESC', [], (err2, rows) => {
        if (err2) return res.status(500).send('DB error');
        return res.render('index', { comments: rows, success: true });
      });
      return;
    }
    // otherwise redirect back to the proxied lab path (avoids proxying to the main app root)
    res.redirect('/lab/xss-stored/');
  });
});

app.get('/health', (req, res) => res.send('ok'));

const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`XSS lab listening on ${port}`));
