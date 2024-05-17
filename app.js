import {authRouter} from './routes/admin/adminAuth.js'
import {appRouter} from './routes/app/appData.js';
import {adminRouter} from './routes/admin/adminData.js';

import {errorHandler} from "./middleware/errorHandler.js"

import {addRootUsers, setDefaultConfigs} from "./config/setupDB.js";

import {scheduleVerificationJob} from "./services/app/scheduleDB.js";

import express from 'express';
import passport from 'passport';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import cors from 'cors';


const SQLiteStore = connectSqlite3(session);

const app = express();

const corsOptions = {
    origin: ["https://locker-api.cvapps.net", "https://locker.cvapps.net"],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

// cors setup
app.use(cors(corsOptions));

// express middleware setup
app.use(express.urlencoded({extended: true}));

// Configure session with connect-sqlite3
app.use(
    session({
        store: new SQLiteStore({
            db: './local-db/sessions.db',
        }),
        secret: process.env.SESSIONSECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1800000, // Set the session timeout to 30 minutes (in milliseconds) 1800000
            domain: '.cvapps.net',
        },
    })
);

// passport initialization
app.use(passport.initialize());
app.use(passport.session());

// setup express json middleware
app.use(express.json());

// define routes
app.use('/auth/', authRouter);
app.use('/public/', appRouter);
app.use('/admin/', adminRouter);

// global error handling middleware - must be at bottom of express stack
app.use(errorHandler);


// create root user
await addRootUsers();

// setup json configs in db
await setDefaultConfigs();

//start the verification queue scheduler
scheduleVerificationJob();

// Start the server
app.listen(3000, () => {
    console.log(`Locker backend started`);
});
