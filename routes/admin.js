import { createUser, createLocker, createUserjoinLocker, getUser, getLocker, joinUsertoLocker } from "../controllers/user-locker.js";
import { ensureAuthenticated } from "./auth.js";

import {Readable} from "stream";
import csvParser from "csv-parser";
import multer from "multer";
import {LockerData} from "../models/lockerData.js";
import express from 'express';

export const adminRouter = express.Router();


//get the users locker and data from student id
adminRouter.get('/lookup-user/:studentId', ensureAuthenticated, async (req, res) => {
  try {
    const studentId = req.params.studentId;

    const userData = await getUser(studentId);

    if (userData) {
      res.json(userData);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


//start goofy ah code todo fix this, make it cleaner

const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

const convertStringValuesToNumbers = (obj) => {
  const result = {};
  result.Num = parseInt(obj.Num);
  result.Location = {
    Building: parseFloat(obj.Building),
    TopBottom: obj.TopBottom === 'bottom' ? 0 : 1, //todo fix this
    Floor: parseFloat(obj.Floor),
    X: parseFloat(obj.X),
    Y: parseFloat(obj.Y),
  };
  return result;
};


export async function createdataLocker(lockerNumber, location) {
  try {
    let locker = await LockerData.create({
      lockerNumber: lockerNumber,
      location: location,
    });
    return locker;
  } catch (err) {
    console.error(err);
    return false;
  }
}

adminRouter.post('/upload', upload.single('csvFile'), async (req, res) => {
  let final;

  // Access the uploaded file buffer
  const fileBuffer = req.file.buffer.toString('utf8');

  // Parse the CSV data
  const parsedData = [];
  Readable.from(fileBuffer) // Use Readable.from to create a readable stream
      .pipe(csvParser({
        columns: true,
        bom: true,
      }))
      .on('data', (row) => {
        parsedData.push(row);
      })
      .on('end', async () => {

        final = parsedData.map(convertStringValuesToNumbers);
        // res.json({ data: final });
        for (const record of final) {
          const lockerNumber = record.Num;
          const location = record.Location;

          await createdataLocker(lockerNumber, location);
        }
      });
});
