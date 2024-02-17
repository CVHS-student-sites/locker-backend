import {loadLockers, loadUsers} from "../../controllers/admin/adminImportData.js";
import {setAreaRestriction, setGradeRestriction} from "../../controllers/admin/adminAction.js";
import {queryAreaRestriction, queryGradeRestriction, queryStats} from "../../controllers/admin/adminData.js";

import {ensureAuthenticated} from "./adminAuth.js";


import express from 'express';
import multer from "multer";

export const adminRouter = express.Router();

adminRouter.use(ensureAuthenticated);


adminRouter.post('/management/grade-restrictions', async (req, res) => {
    const data = req.body;

    if (await setGradeRestriction(data)) {
        res.status(200).json({status: 'upload successful'});
    } else {
        res.status(500).json({status: 'error'});
    }

});

adminRouter.get('/management/grade-restrictions', async (req, res) => {
    try {

        const data = await queryGradeRestriction();

        if (data) {
            res.json(data);
        } else {
            res.status(404).json({error: 'No config found'});
        }
    } catch (error) {
        res.status(500).json({error: 'Internal server error'});
    }
});

adminRouter.post('/management/area-restrictions', async (req, res) => {
    const data = req.body;

    if (await setAreaRestriction(data)) {
        res.status(200).json({status: 'upload successful'});
    } else {
        res.status(500).json({status: 'error'});
    }

});

adminRouter.get('/management/area-restrictions', async (req, res) => {
    try {

        const data = await queryAreaRestriction();

        if (data) {
            res.json(data);
        } else {
            res.status(404).json({error: 'No config found'});
        }
    } catch (error) {
        res.status(500).json({error: 'Internal server error'});
    }
});


//todo getStatistics
//total users, total lockers, last hour,
adminRouter.get('/management/get-statistics', async (req, res) => {

    const data = await queryStats();
    if (data) {
        res.json(data);
    } else {
        res.status(500).json({error: 'Internal server error'});
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
adminRouter.post('/userUpload', lockerUpload.single('csvFile'), async (req, res) => {

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