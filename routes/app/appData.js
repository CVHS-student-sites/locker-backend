import {
    checkVerification,
    getLocker,
    getUser,
    queryAvailableLockers,
    sendVerification,
    validateID,
    verifyStudent
} from "../../controllers/app/appData.js";
import {queryAreaRestriction, queryGradeRestriction} from "../../controllers/admin/adminData.js";

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
appRouter.get('/validate-ID/:studentId', async (req, res) => {
    const studentId = req.params.studentId;

    let result = await validateID(studentId);
    if (result === "ok") {
        res.status(200).end();
    }
    if (result === "invalid") {
        res.status(400).json({error: 'invalid id'});
    }
    if (result === "exists") {
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

appRouter.get('/available-grades/', async (req, res) => {
    try {
        res.json(await queryGradeRestriction());
    } catch (error) {
        res.status(500).json({error: 'Internal server error'});
    }
});

appRouter.get('/available-areas/', async (req, res) => {
    try {
        res.json(await queryAreaRestriction());
    } catch (error) {
        res.status(500).json({error: 'Internal server error'});
    }
});

appRouter.post('/send-verify-student/:studentId', async (req, res) => {
    const studentId = req.params.studentId;
    let user = await UserData.findByPk(studentId);

    try {
        let status = await sendVerification(studentId, user.email);
        if (status){
            res.status(200).end();
        }else{
            res.status(400).end();
        }
    } catch (error) {
        res.status(500).json({error: 'Internal server error'});
    }
});

appRouter.get('/verify-student/:token', async (req, res) => {
    const token = req.params.token;

    try {
        await verifyStudent(token);
        res.status(200).end();
    } catch (error) {
        res.status(500).json({error: 'Internal server error'});
    }
});

appRouter.get('/check-verification/:studentId', async (req, res) => {
    const studentId = req.params.studentId;

    try {

        if(await checkVerification(studentId)){
            res.status(200).json({verified: true});
        }else{
            res.status(200).json({verified: false});
        }

    } catch (error) {
        res.status(500).json({error: 'Internal server error'});
    }
});