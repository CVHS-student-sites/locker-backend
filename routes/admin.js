import {getUser} from "../controllers/user-locker.js";
import {loadUsers} from "../utils/import-data.js";
import {loadLockers} from "../utils/import-data.js";
import {setGradeRestriction} from "../controllers/admin-data.js";

import {ensureAuthenticated} from "./auth.js";

import express from 'express';
import multer from "multer";

export const adminRouter = express.Router();

adminRouter.use(ensureAuthenticated);


adminRouter.post('/management/grade-restrictions', async (req, res) => {
    const data = req.body;
    console.log(data)

    if (await setGradeRestriction(data)) {
        res.status(200);
    } else {
        res.status(500);
    }

});



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