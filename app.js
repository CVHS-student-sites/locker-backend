import {authRouter} from './routes/auth.js'
import { userlockerRouter } from './routes/user-locker.js';
import { adminRouter } from './routes/admin.js';

import express, {response} from 'express';
import passport from 'passport';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import cors from 'cors';

const SQLiteStore = connectSqlite3(session);

const app = express();

const corsOptions = {
    origin: ["https://locker-api.cvapps.net", "https://locker.cvapps.net"], // Replace with your frontend domain, e.g., 'https://cvapps.net'
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
            domain: '.cvapps.net',
        },
    })
);

//passport initalization
app.use(passport.initialize());
app.use(passport.session());

//setup express json middleware
app.use(express.json());

//define routes
app.use('/auth/', authRouter)
app.use('/public/', userlockerRouter)
app.use('/admin/', adminRouter)

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
