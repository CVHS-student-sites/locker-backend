import {router} from './routes/auth.js'

import express, {response} from 'express';
import passport from 'passport';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import cors from 'cors';


const SQLiteStore = connectSqlite3(session);

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend domain, e.g., 'https://cvapps.net'
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials (cookies)
};


// cors setup
app.use(cors(corsOptions));

// Express middleware setup
app.use(express.urlencoded({extended: true}));

// Configure session with connect-sqlite3
app.use(
    session({
        store: new SQLiteStore({
            db: './local-db/sessions.db', // Specify the SQLite database file
        }),
        secret: 'your-secret-key', //TODO store in ENV
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1800000, // Set the session timeout to 30 minutes (in milliseconds) 1800000
            // domain: 'cvapps.net',
        },
    })
);

//passport initalization
app.use(passport.initialize());
app.use(passport.session());


//routes
app.use('/', router)


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
