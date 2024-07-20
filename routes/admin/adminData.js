import {loadLockers, loadUsers} from "../../controllers/admin/adminImportData.js";
import {setAreaRestriction, setGradeRestriction} from "../../controllers/admin/adminAction.js";
import {
    checkLocker,
    clearLockerDB,
    clearUserDB,
    deleteUser,
    getLockerEditData,
    getLockersDB,
    getUserEditData,
    getUsersDB,
    manualCreateUser,
    queryAreaRestriction,
    queryGradeRestriction,
    queryStats,
    removeLockerFromUser,
    updateLockerEditData,
    updateUserEditData
} from "../../controllers/admin/adminData.js";

import {ensureAuthenticated} from "./adminAuth.js";

import path from 'path';
import {fileURLToPath} from 'url';
import express from 'express';
import multer from "multer";
import {generateLockerCSV, generateUserCSV} from "../../utils/admin/csvgen/generateCSV.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const adminRouter = express.Router();

adminRouter.use(ensureAuthenticated);

adminRouter.use('/data', express.static(path.join(__dirname, 'data-temp')));


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
adminRouter.get('/edit/check-locker/:lockerNum', async (req, res, next) => {
    const lockerNum = req.params.lockerNum;
    try {
        let data = await checkLocker(lockerNum);
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
        const filePath = path.join(process.cwd(), 'data-temp/locker.csv');

        setTimeout(() => {
            res.download(filePath, 'locker.csv', (err) => {
                if (err) {
                    console.error('Error sending file:', err);
                    res.status(500).send('Error downloading file');
                }
            });
        }, 500); //add a delay to prevent fuck-ups

    } catch (error) {
        next(error);
    }
});

//todo might just be better to serve the entire csv dir as a static with cred verification instead of sending file
adminRouter.get('/csv-action/gen-user-csv', async (req, res, next) => {
    try {
        await generateUserCSV();
        const filePath = path.join(process.cwd(), 'data-temp/user.csv');

        setTimeout(() => {
            res.download(filePath, 'users.csv', (err) => {
                if (err) {
                    console.error('Error sending file:', err);
                    res.status(500).send('Error downloading file');
                }
            });
        }, 500); //add a delay to prevent fuck-ups

    } catch (error) {
        next(error);
    }
});

//todo maybe move file upload and handling to adminData.js
const lockerStorage = multer.memoryStorage(); // Store the file in memory
const lockerUpload = multer({storage: lockerStorage});
adminRouter.post('/lockerUpload', lockerUpload.single('csvFile'), async (req, res) => {
    const fileBuffer = req.file.buffer.toString('utf8');
    try {
        await loadLockers(fileBuffer);
        res.status(200).json({status: 'upload successful'});
    } catch (error) {
        res.status(500).json({error: 'error uploading csv'});
    }
});


const userStorage = multer.memoryStorage(); // Store the file in memory
const userUpload = multer({storage: userStorage});
adminRouter.post('/userUpload', userUpload.single('csvFile'), async (req, res) => {
    const fileBuffer = req.file.buffer.toString('utf8');
    try {
        await loadUsers(fileBuffer);
        res.status(200).json({status: 'upload successful'});
    } catch (error) {
        res.status(500).json({error: 'error uploading csv'});
    }
});