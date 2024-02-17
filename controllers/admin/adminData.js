//used for getting and interacting with locker data for admins

import {User} from "../../models/user.js";
import {Locker} from "../../models/locker.js";

//todo will have functions for getting data for dashboard, locker lists, user lists
import {readConfig} from "../../utils/admin/configManager.js";


export async function queryGradeRestriction(){
    try {
        console.log(await readConfig('enabled_grades'))
        return await readConfig('enabled_grades');

    }catch (err){
        return false;
    }
}

export async function queryAreaRestriction(){
    try {
        return await readConfig('restricted_areas');
    }catch (err){
        return false;
    }
}

export async function queryStats(){
    let userCount;
    let lockerCount;

    await User.count()
        .then(count => {
            userCount = count;
        })
        .catch(err => {
            return false;
        });

    await Locker.count()
        .then(count => {
            lockerCount = count;
            console.log(lockerCount)
        })
        .catch(err => {
            return false;
        });

    return {
        "users": userCount,
        "lockers": lockerCount,
    };
}