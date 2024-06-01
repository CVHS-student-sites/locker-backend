import {loadLockers, loadUsers} from "../../controllers/admin/adminImportData.js";
import {setAreaRestriction, setGradeRestriction} from "../../controllers/admin/adminAction.js";
import {
    queryAreaRestriction,
    queryGradeRestriction,
    queryStats,
    getUsersDB,
    getLockersDB,
    getUserEditData,
    getLockerEditData,
    updateUserEditData,
    updateLockerEditData,
    deleteUser,
    removeLockerFromUser,
    manualCreateUser,
    clearUserDB, clearLockerDB
} from "../../controllers/admin/adminData.js";

import {ensureAuthenticated} from "./adminAuth.js";


import express from 'express';
import multer from "multer";
import {generateLockerCSV} from "../../utils/admin/csvgen/generateCSV.js";

export const adminRouter = express.Router();

adminRouter.use(ensureAuthenticated);


adminRouter.post('/management/grade-restrictions', async (req, res) => {
    const data = req.body;

    if (await setGradeRestriction(data)) {
        res.status(200).json({status: 'upload successful'});
    } else {
        res.status(500).json({status: 'Internal server error'});
    }

});

adminRouter.get('/management/grade-restrictions', async (req, res) => {
    try {
        const data = await queryGradeRestriction();
        res.json(data);
    } catch (error) {
        res.status(500).json({error: 'Internal server error'});
    }
});

//todo make try catch block
adminRouter.post('/management/area-restrictions', async (req, res) => {
    const data = req.body;

    if (await setAreaRestriction(data)) {
        res.status(200).json({status: 'upload successful'});
    } else {
        res.status(500).json({status: 'Internal server error'});
    }

});

adminRouter.get('/management/area-restrictions', async (req, res) => {
    try {
        const data = await queryAreaRestriction();
        res.json(data);
    } catch (error) {
        res.status(500).json({error: 'Internal server error'});
    }
});


//total users, total lockers, last hour,

//todo add error handling middleware here
adminRouter.get('/management/get-statistics', async (req, res) => {
    try {
        const data = await queryStats();
        res.json(data);
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});


adminRouter.get('/data/user-data', async (req, res) => {
    try {
        let data = await getUsersDB();
        res.json(data);
    } catch (error) {
        //todo add route error middleware
        console.error('Error fetching data:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});


adminRouter.get('/data/locker-data', async (req, res) => {
    try {
        let data = await getLockersDB();
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});


adminRouter.get('/edit/user-edit/:studentId', async (req, res, next) => {
    const studentId = req.params.studentId;
    try {
        let data = await getUserEditData(studentId);
        res.json(data);
    } catch (error) {
        next(error);
    }
});
adminRouter.get('/edit/locker-edit/:lockerNum', async (req, res, next) => {
    const lockerNum = req.params.lockerNum;
    try {
        let data = await getLockerEditData(lockerNum);
        res.json(data);
    } catch (error) {
        next(error);
    }
});


adminRouter.post('/edit/user-edit/:studentId', async (req, res, next) => {
    const studentId = req.params.studentId;
    const dataBody = req.body;
    try {
        await updateUserEditData(studentId, dataBody);
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
});
adminRouter.post('/edit/locker-edit/:lockerNum', async (req, res, next) => {
    const lockerNum = req.params.lockerNum;
    const dataBody = req.body;

    try {
        await updateLockerEditData(lockerNum, dataBody);
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
});


adminRouter.post('/edit/delete-user/:studentId', async (req, res, next) => {
    const studentId = req.params.studentId;
    try {
        await deleteUser(studentId);
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
});
adminRouter.post('/edit/remove-users-locker/:studentId', async (req, res, next) => {
    const studentId = req.params.studentId;
    try {
        await removeLockerFromUser(studentId);
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
});


adminRouter.post('/manual/create-user', async (req, res, next) => {
    const dataBody = req.body;
    try {
        await manualCreateUser(dataBody);
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
});


adminRouter.post('/db-action/clear-lockers', async (req, res, next) => {
    const dataBody = req.body;
    try {
        await clearLockerDB(dataBody);
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
});

adminRouter.post('/db-action/clear-users', async (req, res, next) => {
    const dataBody = req.body;
    try {
        await clearUserDB(dataBody);
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
});


adminRouter.get('/csv-action/gen-locker-csv', async (req, res, next) => {
    try {
        await generateLockerCSV();
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
});


//todo maybe move file upload and handling to adminData.js
const lockerStorage = multer.memoryStorage(); // Store the file in memory
const lockerUpload = multer({storage: lockerStorage});
adminRouter.post('/lockerUpload', lockerUpload.single('csvFile'), async (req, res) => {

    // Access the uploaded file buffer
    const fileBuffer = req.file.buffer.toString('utf8');

    try {
        // Use await to wait for the loadUsers function to complete
        await loadLockers(fileBuffer);

        // Send a success response if the loadUsers function completes without errors
        res.status(200).json({status: 'upload successful'});
    } catch (error) {
        // Handle errors and send an error response
        console.error(error);
        res.status(500).json({error: 'error uploading csv'});
    }
});


const userStorage = multer.memoryStorage(); // Store the file in memory
const userUpload = multer({storage: userStorage});
adminRouter.post('/userUpload', userUpload.single('csvFile'), async (req, res) => {

    // Access the uploaded file buffer
    const fileBuffer = req.file.buffer.toString('utf8');

    try {
        // Use await to wait for the loadUsers function to complete
        await loadUsers(fileBuffer);

        // Send a success response if the loadUsers function completes without errors
        res.status(200).json({status: 'upload successful'});
    } catch (error) {
        // Handle errors and send an error response
        console.error(error);
        res.status(500).json({error: 'error uploading csv'});
    }
});