import {LockerData} from "../models/lockerData.js";
import {UserData} from "../models/userData.js";
import {Readable} from "stream";
import csvParser from "csv-parser";

const formatLockerData = (obj) => {
    const result = {};
    result.Num = parseInt(obj.Num);
    result.Location = {
        Building: parseInt(obj.Building),
        TopBottom: obj.TopBottom === 'bottom' ? 0 : 1,
        Floor: parseInt(obj.Floor),
        X: parseFloat(obj.X),
        Y: parseFloat(obj.Y),
    };
    return result;
};

async function createLockerBatch(data) {
    try {
        return await LockerData.bulkCreate(data);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function loadLockers(fileBuffer) {
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
                    const final = parsedData.map(formatLockerData);

                    // Convert the data array to match the structure of individual records
                    const batchData = final.map(({Num, Location}) => ({
                        lockerNumber: Num,
                        location: Location,
                    }));
                    console.log(batchData)
                    await createLockerBatch(batchData);

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




//user upload
const formatUserData = (obj) => {
    const result = {};
    result.studentId = parseInt(obj.studentId);
    result.grade = parseInt(obj.grade);
    return result;
};

async function createUserBatch(data) {
    try {
        return await UserData.bulkCreate(data);
    } catch (err) {
        console.error(err);
        throw err;
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
                    const final = parsedData.map(formatUserData);

                    const batchData = final.map(({studentId, grade}) => ({
                        studentId: studentId,
                        grade: grade,
                    }));

                    console.log(batchData)
                    await createUserBatch(batchData);

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
