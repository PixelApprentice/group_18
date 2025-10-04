const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'insecure-secret', resave: false, saveUninitialized: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const db = new sqlite3.Database(':memory:');
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)');
  db.run('DELETE FROM users');
  const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
  stmt.run('alice', 'password123');
  stmt.run('bob', 'qwerty');
  stmt.run('victim', 'guessme');
  stmt.finalize();
});

app.get('/', (req, res) => {
  // if redirected after successful login, we can show a subtle success banner
  const success = req.query.s === '1' && req.session && req.session.user;
  res.render('index', { user: req.session.user || null, message: null, success });
});

// insecure login (no hashing, no rate limit, predictable messages)
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT id, username FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (err) {
      return res.render('index', { user: null, message: 'Server error' });
    }
    if (row) {
      req.session.user = { id: row.id, username: row.username };
      // Render the index immediately with a success message so clients don't need to follow a redirect.
      return res.render('index', { user: req.session.user, message: null, success: true });
    }
    // check if username exists to provide clearer feedback
    db.get('SELECT id FROM users WHERE username = ?', [username], (err2, exists) => {
      if (err2) return res.render('index', { user: null, message: 'Server error' });
      if (!exists) return res.render('index', { user: null, message: 'User not found' });
      return res.render('index', { user: null, message: 'Invalid credentials' });
    });
  });
});

app.post('/logout', (req, res) => {
  // Destroy session and render the lab page immediately to avoid issuing a redirect
  // which causes the client (or proxy) to issue another GET that may be routed to
  // the main app root if an upstream is missing, producing a 502. Rendering keeps
  // the flow on a single response and is more reliable in labs-only mode.
  req.session.destroy(() => {
    return res.render('index', { user: null, message: 'You have logged out.', success: false });
  });
});

app.get('/health', (req, res) => res.send('ok'));

const port = process.env.PORT || 3003;
app.listen(port, () => console.log(`Broken auth lab listening on ${port}`));
