import {Locker} from "../../../models/locker.js";
import {User} from "../../../models/user.js";
import {UserData} from "../../../models/userData.js";

import {createObjectCsvWriter} from "csv-writer";


//generate a csv from database matching import format for the locker locator
export async function generateLockerCSV() {

    Locker.findAll().then(lockers => {
        const filteredData = lockers.map(locker => ({
            Num: locker.lockerNumber,
            Building: locker.location.Building,
            Floor: locker.location.Floor,
            Level: locker.location.Level,
            Status: locker.status
        }));

        const csvWriter = createObjectCsvWriter({
            path: './data-temp/locker.csv',
            header: [
                {id: 'Num', title: 'Num'},
                {id: 'Building', title: 'Building'},
                {id: 'Floor', title: 'Floor'},
                {id: 'Level', title: 'Level'},
                {id: 'Status', title: 'Status'},
            ],
        });

        csvWriter.writeRecords(filteredData);
    });
}

//todo im not sure how useful is is to export userData, better to export Users in the format of UserData, to be able to import as as student locator
//generate a csv from database matching import format for the student locator
export async function generateStudentLocatorCSV() {

    User.findAll().then(users => {
        const filteredData = users.map(user => ({
            studentId: user.studentId,
            name: user.name,
            grade: user.grade,
            email: user.email,
            permissions: user.permissions
        }));

        const csvWriter = createObjectCsvWriter({
            path: './data-temp/userData.csv',
            header: [
                {id: 'studentId', title: 'studentId'},
                {id: 'name', title: 'name'},
                {id: 'grade', title: 'grade'},
                {id: 'email', title: 'email'},
                {id: 'permissions', title: 'permissions'},
            ],
        });

        csvWriter.writeRecords(filteredData);
    });
}