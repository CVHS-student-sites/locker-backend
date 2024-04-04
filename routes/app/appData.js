import {getLocker, getUser, validateIDs, sendVerification} from "../../controllers/app/appData.js";
import { queryAvailableLockers } from "../../controllers/app/appData.js";

import express from 'express';
import {UserData} from "../../models/userData.js";

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


//todo try catch
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

appRouter.get('/available-lockers/', async (req, res) => {
    try {
        res.json(await queryAvailableLockers());
    } catch (error) {
        res.status(500).json({error: 'Internal server error'});
    }
});

appRouter.post('/send-verify-student/:studentId', async (req, res) => {
    const studentId = req.params.studentId;

    let user = await UserData.findByPk(studentId);


    try {
        await sendVerification(studentId, user.email);
        res.status(200).end();
        // console.log(user.email)
    } catch (error) {
        res.status(500).json({error: 'Internal server error'});
    }
});

appRouter.get('/verify-student/:studentId', async (req, res) => {
    const studentId = req.params.studentId;

    // let user = await UserData.findByPk(studentId);
    //todo check is uuid is in table and add add student to users table
    try {
        await sendVerification(studentId, 'birdpump@gmail.com')
        // console.log(user.email)
    } catch (error) {
        res.status(500).json({error: 'Internal server error'});
    }
});