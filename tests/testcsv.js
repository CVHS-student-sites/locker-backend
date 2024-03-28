import fs from 'fs';
import { parse } from 'csv-parse';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { LockerData } from "../models/lockerData.js";
// import { Locker } from "../models/locker.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const convertStringValuesToNumbers = (obj) => {
    const result = {};
    result.Num = parseInt(obj.Num);
    result.Location = {
        Building: parseFloat(obj.Building),
        TopBottom: obj.TopBottom === 'bottom' ? 0 : 1, //todo fix this to levels
        Floor: parseFloat(obj.Floor),
        X: parseFloat(obj.X),
        Y: parseFloat(obj.Y),
    };
    return result;
};

const processFile = async () => {
    const records = [];
    const parser = fs
        .createReadStream(`${__dirname}/l.csv`)
        .pipe(parse({
            columns: true,
            bom: true,
        }));

    for await (const record of parser) {
        records.push(record);
    }

    return records;
};

export async function createLocker(lockerNumber, location) {
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

const importData = async () => {
    const records = await processFile();
    const convertedData = records.map(convertStringValuesToNumbers);

    for (const record of convertedData) {
        const lockerNumber = record.Num;
        const location = record.Location;

        await createLocker(lockerNumber, location);
    }
};

await importData();
