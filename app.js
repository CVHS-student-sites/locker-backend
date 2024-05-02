import {authRouter} from './routes/admin/adminAuth.js'
import {appRouter} from './routes/app/appData.js';
import {adminRouter} from './routes/admin/adminData.js';

import {errorHandler} from "./middleware/errorHandler.js"

import {addTestUsers, setDefaultConfigs} from "./config/setupDB.js";

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
app.use('/auth/', authRouter);
app.use('/public/', appRouter);
app.use('/admin/', adminRouter);

//global error handling middleware - must be at bottom of express stack
app.use(errorHandler);


//create root user
await addTestUsers();

await setDefaultConfigs();

//start the verification queue scheduler
scheduleVerificationJob();

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Locker backend started`);
});
