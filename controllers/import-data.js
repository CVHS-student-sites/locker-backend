import { LockerData } from "../models/lockerData.js";
import { Readable } from "stream";
import csvParser from "csv-parser";
import multer from "multer";

const convertStringValuesToNumbers = (obj) => {
    const result = {};
    result.Num = parseInt(obj.Num);
    result.Location = {
        Building: parseFloat(obj.Building),
        TopBottom: obj.TopBottom === 'bottom' ? 0 : 1,
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
        throw err; // Throw the error to propagate it to the calling function
    }
}


export async function createdataLockerBatch(data) {
    try {

        let locker = await LockerData.bulkCreate(data);
        return locker;
    } catch (err) {
        console.error(err);
        throw err; // Throw the error to propagate it to the calling function
    }
}

export async function loadUsers(fileBuffer) {
    return new Promise((resolve, reject) => {
        const parsedData = [];
        Readable.from(fileBuffer)
            .pipe(csvParser({
                columns: true,
                bom: true,
            }))
            .on('data', (row) => {
                parsedData.push(row);
            })
            .on('end', async () => {
                try {
                    const final = parsedData.map(convertStringValuesToNumbers);

                    // for (const record of final) {
                    //     const lockerNumber = record.Num;
                    //     const location = record.Location;
                    //
                    //     await createdataLocker(lockerNumber, location);
                    // }

                    let batchSize = 80;
                    for (let i = 0; i < final.length; i += batchSize) {
                        // Slice the array to get a batch of elements
                        const batch = final.slice(i, i + batchSize);

                        // Call the callback function to process the batch
                        await createdataLockerBatch(batch);
                    }

                    resolve(true);
                } catch (error) {
                    reject(error);
                }
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}
