import { createUser, validateUser, getId, getUser, getUserfromId } from '../controllers/admin.js'

import express from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

export const router = express.Router();


// Passport configuration
passport.use(
  new LocalStrategy(async (username, password, cb) => {
    const response = await validateUser(username, password)

    if (!response) {
      return cb(null, false, { message: 'Incorrect username or password' });
    }
    let user = await getUser(username)
    return cb(null, user);
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user.userId);
});

passport.deserializeUser(async (id, cb) => {
  const user = await getUserfromId(id)
  cb(null, user);
});


// middleware function to check if the user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, proceed to the next middleware or route
  }
  // User is not authenticated, redirect to the login page or send an error message
  res.redirect('/login'); // You can customize the login route as needed
}


// Main Admin Login Routes
router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Hello, ${req.user.username}! <a href="/logout">Logout</a>`);
  } else {
    res.send('Welcome! <a href="/login">Login</a>');
  }
});

router.get('/login', (req, res) => {
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

// router.post(
//     '/login',
//     passport.authenticate('local', {
//         successRedirect: '/',
//         failureRedirect: '/login',
//     })
// );

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err); // Handle unexpected errors
    }
    if (!user) {
      // Authentication failed, send a 401 Unauthorized status
      return res.status(401).json({ authenticated: false, message: 'Authentication failed' });
    }

    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }

      // Authentication successful, send a 200 OK status
      return res.status(200).json({ authenticated: true });
    });
  })(req, res, next);
});

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

router.get('/admin', ensureAuthenticated, (req, res) => {
  res.send('Welcome! you are logged in');
});

router.get('/checkauth', (req, res) => {
  // Check the user's authentication status (you need to implement this logic)
  const isAuthenticated = req.isAuthenticated();

  if (isAuthenticated) {
    // User is authenticated, return a success response with status 200
    res.status(200).json({
      authenticated: true,
      user: {
        id: req.user.userId,
        username: req.user.username,
        // other user-related information
      },
    });
  } else {
    // User is not authenticated, return an error response with status 401
    res.status(401).json({
      authenticated: false,
      error: 'Authentication required',
    });
  }
});

// Main user routes


// Main admin ui routes