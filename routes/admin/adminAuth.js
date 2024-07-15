import {getAdminUser, getAdminUserfromId, validateAdminUser} from '../../controllers/admin/adminUser.js';

import express from 'express';
import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';

export const authRouter = express.Router();


// Passport configuration
passport.use(
    new LocalStrategy(async (username, password, cb) => {
        const response = await validateAdminUser(username, password);

        if (!response) {
            return cb(null, false, {message: 'Incorrect username or password'});
        }
        let user = await getAdminUser(username);
        return cb(null, user);
    })
);

passport.serializeUser((user, cb) => {
    cb(null, user.userId);
});

passport.deserializeUser(async (id, cb) => {
    const user = await getAdminUserfromId(id);
    cb(null, user);
});


// middleware function to check if the user is authenticated
export function ensureAuthenticated(req, res, next) {
    // Check if the user is authenticated using sessions
    if (req.isAuthenticated()) {
        return next(); // User is authenticated, proceed to the next middleware or route
    }

    // Check if an API key is provided in the request headers
    const apiKey = req.headers['x-api-key'];

    if (apiKey) {
        // Validate the API key (replace 'your_secret_api_key' with your actual API key)
        if (apiKey === process.env.APIKEY) {
            return next(); // API key is valid, proceed to the next middleware or route
        }
    }

    // User is not authenticated and no valid API key is provided
    res.status(401).json({
        authenticated: false,
        error: 'Authentication required for route',
    });
}


authRouter.post('/login', express.json(), (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err); // Handle unexpected errors
        }
        if (!user) {
            // Authentication failed, send a 401 Unauthorized status
            return res.status(401).json({authenticated: false, message: 'Incorrect Credentials'});
        }

        req.login(user, (loginErr) => {
            if (loginErr) {
                return next(loginErr);
            }

            // Authentication successful, send a 200 OK status
            return res.status(200).json({authenticated: true, user: user.username});
        });
    })(req, res, next);
});


authRouter.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.status(204).end(); // Send a response with status code 204 and end the response
    });
});


authRouter.get('/checkauth', (req, res) => {
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