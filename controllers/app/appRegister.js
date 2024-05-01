//all registration logic will go on here

import {User} from "../../models/user.js";
import {Locker} from "../../models/locker.js";

import {Op} from "sequelize";
import {queryAreaRestriction, queryGradeRestriction} from "../admin/adminData.js";
import {UserData} from "../../models/userData.js";
import {throwApplicationError} from "../../middleware/errorHandler.js";
import {parse} from "csv-parse";


export async function registerUserToLocker(data) {
    //studentID, building, floor, level

    let students = data.students;
    let location = data.location;

    let enableGrades = await queryGradeRestriction();

    let canRegister = false;

    for (let student of students) {
        const studentData = await UserData.findByPk(student);
        const gradeKey = "grade_" + studentData.grade;
        // Check if the grade exists in the JSON object and if it's enabled
        if (enableGrades.hasOwnProperty(gradeKey) && enableGrades[gradeKey]) {
            canRegister = true;
        }
    }

    // check 1 - validate grade can register
    if(!canRegister) throwApplicationError('Grade Cannot Register');


    let areaRestricted = true;
    let areaData = await queryAreaRestriction();
    const areas = {};
    for (const buildingKey in areaData) {
        const buildingNumber = parseInt(buildingKey.split('_')[1]);
        const floors = [];
        for (const floorKey in areaData[buildingKey]) {
            if (areaData[buildingKey][floorKey] === false) {
                const floorNumber = parseInt(floorKey.split('_')[1]);
                floors.push(floorNumber);
            }
        }
        areas[buildingNumber] = floors;
    }

    if (areas.hasOwnProperty(parseInt(location.building))) {
        if (areas[location.building].includes(parseInt(location.floor))) {
            areaRestricted = false;
        }
    }
    // check 2 - validate area isn't restricted
    if(areaRestricted) throwApplicationError('Selected Area is Restricted');

    //todo some checks that need to be run:
    // - check available areas

    //todo run a ton of data checks here, this is critical logic that will inevitably break
    // - check if there are allready people in a locker > 2


    let lockerArray = await Locker.findAll({
        where: {
            "location.Building": {[Op.eq]: location.building},
            "location.Floor": {[Op.eq]: location.floor},
            "location.Level": {[Op.eq]: location.level},
        },
        include: [{
            model: User,
        }]

    });


    const filteredLockers = lockerArray.filter(Locker => Locker.Users.length === 0); //check for standard lockers, todo needs to check less than 0 for single lockers


    //todo write some logic to do something if lockerArray is empty (no lockers avalible in the selected area), this should throw an error

    let selectedLocker = filteredLockers[0]; //todo find a better way to select lockers, this would work but seems kinda low tech

    for (let student of students) {
        let selectedUser = await User.findByPk(student);
        console.log(selectedUser);
        selectedUser.setLocker(selectedLocker)
    }
}