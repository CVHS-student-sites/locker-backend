import {LockerData} from "../models/lockerData.js";

import {Readable} from "stream";
import csvParser from "csv-parser";
import multer from "multer";

//begin new code todo test all of this

const convertStringValuesToNumbers = (obj) => {
    const result = {};
    result.Num = parseInt(obj.Num);
    result.Location = {
        Building: parseFloat(obj.Building), TopBottom: obj.TopBottom === 'bottom' ? 0 : 1, //todo fix this
        Floor: parseFloat(obj.Floor), X: parseFloat(obj.X), Y: parseFloat(obj.Y),
    };
    return result;
};

export async function createdataLocker(lockerNumber, location) {
    try {
        let locker = await LockerData.create({
            lockerNumber: lockerNumber, location: location,
        });
        return locker;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export async function loadUsers(fileBuffer) {
    let final;
    const parsedData = [];
    Readable.from(fileBuffer) // Use Readable.from to create a readable stream
        .pipe(csvParser({
            columns: true, bom: true,
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
}