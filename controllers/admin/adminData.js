//used for getting and interacting with locker data for admins

//todo will have functions for getting data for dashboard, locker lists, user lists

import {createConfig, readConfig, editConfig} from "../../utils/admin/configManager.js";


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