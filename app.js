//perviously fix.js, tested chatgpt code converted to a module by chatgpt

import express from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
const SQLiteStore = connectSqlite3(session);

const app = express();

// Simulated user database (replace with your database)
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' },
];

// Passport configuration
passport.use(
  new LocalStrategy((username, password, done) => {
    const user = users.find((user) => user.username === username);
    if (!user || user.password !== password) {
      return done(null, false, { message: 'Incorrect username or password' });
    }
    return done(null, user);
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find((user) => user.id === id);
  done(null, user);
});

// Express middleware setup
app.use(express.urlencoded({ extended: true }));

// Configure session with connect-sqlite3
app.use(
  session({
    store: new SQLiteStore({
      db: 'sessions.db', // Specify the SQLite database file
    }),
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1800000, // Set the session timeout to 30 minutes (in milliseconds)
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Hello, ${req.user.username}! <a href="/logout">Logout</a>`);
  } else {
    res.send('Welcome! <a href="/login">Login</a>');
  }
});

app.get('/login', (req, res) => {
  res.send(`
    <form action="/login" method="post">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required>
      </div>
      <div>
        <button type="submit">Login</button>
      </div>
    </form>
  `);
});

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
);

app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
    console.log(err);
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
