import {getUser} from "../controllers/user-locker.js";
import {loadUsers} from "../controllers/import-data.js";

import {ensureAuthenticated} from "./auth.js";

import express from 'express';
import multer from "multer";

export const adminRouter = express.Router();


//get the users locker and data from student id
adminRouter.get('/lookup-user/:studentId', ensureAuthenticated, async (req, res) => {
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


const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({storage: storage});
adminRouter.post('/upload', upload.single('csvFile'), async (req, res) => {
    let final;

    // Access the uploaded file buffer
    const fileBuffer = req.file.buffer.toString('utf8');

    if (await loadUsers(fileBuffer)) {
        res.status(200).json({status: 'upload successful'});
    }
});
