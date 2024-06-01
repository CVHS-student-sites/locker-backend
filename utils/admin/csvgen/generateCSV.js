import {Locker} from "../../../models/locker.js";
import {createObjectCsvWriter} from "csv-writer";

import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


//function that will generate a csv from database matching import format for the locker locator
export async function generateLockerCSV() {

    console.log(__dirname);

    Locker.findAll().then(lockers => {

        const filteredData = lockers.map(locker => ({
            Num: locker.lockerNumber,
            Building: locker.location.Building,
            Floor: locker.location.Floor,
            Level: locker.location.Level,
            Status: locker.status
        }));


        const csvWriter = createObjectCsvWriter({
            path: 'test.csv',
            header: [
                {id: 'Num', title: 'Num'},
                {id: 'Building', title: 'Building'},
                {id: 'Floor', title: 'Floor'},
                {id: 'Level', title: 'Level'},
                {id: 'Status', title: 'Status'},
            ],
        });


        csvWriter.writeRecords(filteredData).then(() => {
            console.log('CSV file successfully written.');
        }).catch(err => {
            console.error('Error writing CSV file:', err);
        });


    });
}