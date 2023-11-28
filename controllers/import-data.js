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
    return new Promise((resolve, reject) => {
        const parsedData = [];
        Readable.from(fileBuffer) // Use Readable.from to create a readable stream
            .pipe(csvParser({
                columns: true, bom: true,
            }))
            .on('data', (row) => {
                parsedData.push(row);
            })
            .on('end', async () => {
                const final = parsedData.map(convertStringValuesToNumbers);

                for (const record of final) {
                    const lockerNumber = record.Num;
                    const location = record.Location;

                    await createdataLocker(lockerNumber, location);
                }

                resolve(true); // Resolve the promise when all operations are complete
            })
            .on('error', (error) => {
                reject(error); // Reject the promise if there's an error
            });
    });
}
