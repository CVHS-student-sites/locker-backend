import {LockerData} from "../../models/lockerData.js";
import { Locker } from "../../models/locker.js";
import {UserData} from "../../models/userData.js";
import {Readable} from "stream";

import { parse } from 'csv-parse';

const formatLockerData = (obj) => {
    const result = {};
    result.Num = parseInt(obj.Num);
    result.Location = {
        Building: parseInt(obj.Building),
        Level: obj.Level, //todo idk what type this is supposed to be, decide that fast! seems like should be int 0-3
        Floor: parseInt(obj.Floor),
    };
    return result;
};

//todo if making single unified db, check here if lockers allready exist or force override

//todo empty db before upload for import locker and users
async function createLockerBatch(data) {
    try {
        return await Locker.bulkCreate(data);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function loadLockers(fileBuffer) {
    return new Promise((resolve, reject) => {

        const parsedData = [];
        Readable.from(fileBuffer)  // Use Readable.from to create a readable stream
            .pipe(parse({
                bom: true,
                delimiter: ',', // Add any other options you need
                columns: true,
            }))
            .on('data', (record) => {
                // Your transformation logic here (if needed)
                parsedData.push(record);
            })
            .on('end', async () => {
                try {
                    const final = parsedData.map(formatLockerData);

                    // Convert the data array to match the structure of individual records
                    const batchData = final.map(({Num, Location}) => ({
                        lockerNumber: Num,
                        location: Location,
                    }));
                    console.log(batchData[5])
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
    result.email = obj.email;
    result.name = obj.name;
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

//todo make sure email field works
export async function loadUsers(fileBuffer) {
    return new Promise((resolve, reject) => {
        const parsedData = [];
        Readable.from(fileBuffer)
            .pipe(parse({
                bom: true,
                delimiter: ',', // Add any other options you need
                columns: true,
            }))
            .on('data', (row) => {
                parsedData.push(row);
            })
            .on('end', async () => {
                try {
                    console.log(parsedData[5])
                    const final = parsedData.map(formatUserData);
                    console.log(final[5])

                    const batchData = final.map(({studentId, grade, email, name}) => ({
                        studentId: studentId,
                        grade: grade,
                        email: email,
                        name: name
                    }));

                    console.log(batchData[5])
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
