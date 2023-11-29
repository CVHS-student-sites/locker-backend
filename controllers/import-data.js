import {LockerData} from "../models/lockerData.js";
import {Readable} from "stream";
import csvParser from "csv-parser";

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

async function createdataLockerBatch(data) {
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

                    // Convert the data array to match the structure of individual records
                    const batchData = final.map(({Num, Location}) => ({
                        lockerNumber: Num,
                        location: Location,
                    }));

                    await createdataLockerBatch(batchData);

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
