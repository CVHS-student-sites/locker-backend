import {getLocker, getUser, validateIDs} from "../../controllers/app/appData.js";
import { queryAvailableLockers } from "../../controllers/app/appData.js";

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
    let result = await validateIDs(req.body);
    if (result==="ok"){
        res.status(200).end();
    }
    if (result==="invalid"){
        res.status(400).json({error: 'invalid id'});
    }
    if(result==="exists"){
        res.status(400).json({error: 'locker exists'});
    }

});



//register a locker
appRouter.get('/register-locker/', async (req, res) => {
    let counts = await queryAvailableLockers();
    res.status(200);

});