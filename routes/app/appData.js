import {getLocker, getUser, validateIDs} from "../../controllers/app/appData.js";

import express from 'express';

export const appRouter = express.Router();


//get the users locker and data from student id
appRouter.get('/lookup-user/:studentId', async (req, res) => {
    try {
        const studentId = req.params.studentId;

        const userData = await getUser(studentId);

        if (userData) {
            res.json(userData);
        } else {
            res.status(404).json({error: 'User not found'});
        }
    } catch (error) {
        res.status(500).json({error: 'Internal server error'});
    }
});


//get the lockers users and data from locker number
appRouter.get('/lookup-locker/:lockerNumber', async (req, res) => {
    try {
        const lockerNumber = req.params.lockerNumber;

        const lockerData = await getLocker(lockerNumber);

        if (lockerData) {
            res.json(lockerData);
        } else {
            res.status(404).json({error: 'Locker not found'});
        }
    } catch (error) {
        res.status(500).json({error: 'Internal server error'});
    }
});


appRouter.get('/validate-IDs', async (req, res) => {
    if (await validateIDs(req.body)) {
        res.status(200);
    } else {
        res.status(400).json({error: 'invalid id'});
    }

});


//regiser a locker
appRouter.post('/register-locker/', async (req, res) => {
    let data = req.body;
    //todo needs to go with the algo to pick locker locations, will need to be realtime

});