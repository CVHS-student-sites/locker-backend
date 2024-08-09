import {Locker} from "../../models/locker.js";
import {UserData} from "../../models/userData.js";
import {Readable} from "stream";

import {parse} from 'csv-parse';


//todo we want to add a status filed to the locker locator, implement that here
const formatLockerData = (obj) => {
    const result = {};
    result.Num = obj.Num;
    result.Location = {
        Building: parseInt(obj.Building),
        Level: obj.Level,
        Floor: parseInt(obj.Floor),
    };
    return result;
};

async function createLockerBatch(data) {
    try {
        //todo this doesnt work, gives an error

        // await Locker.destroy({
        //     truncate: true,
        //     cascade: true,
        //     restartIdentity: true
        // });
        return await Locker.bulkCreate(data);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function loadLockers(fileBuffer) {
    return new Promise((resolve, reject) => {
        const parsedData = [];
        Readable.from(fileBuffer)
            .pipe(parse({
                bom: true,
                delimiter: ',',
                columns: true,
            }))
            .on('data', (record) => {
                parsedData.push(record);
            })
            .on('end', async () => {
                try {
                    const final = parsedData.map(formatLockerData);

                    const batchData = final.map(({Num, Location}) => ({
                        lockerNumber: Num,
                        location: Location,
                    }));

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


//todo document user upload csv file format
const formatUserData = (obj) => {
    const result = {};
    result.studentId = parseInt(obj.studentId);
    result.grade = parseInt(obj.grade);
    if (obj.permissions === "pre") {
        result.permissions = 1;
    } else {
        result.permissions = null;
    }
    result.email = obj.email;
    result.name = obj.name;
    return result;
};

async function createUserBatch(data) {
    try {
        await UserData.destroy({
            truncate: true,
            cascade: false,
            restartIdentity: true
        });
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
            .pipe(parse({
                bom: true,
                delimiter: ',',
                columns: true,
            }))
            .on('data', (row) => {
                parsedData.push(row);
            })
            .on('end', async () => {
                try {
                    const final = parsedData.map(formatUserData);

                    const batchData = final.map(({studentId, grade, permissions, email, name}) => ({
                        studentId: studentId,
                        grade: grade,
                        permissions: permissions,
                        email: email,
                        name: name
                    }));

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
