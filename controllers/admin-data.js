import {createConfig, readConfig, editConfig} from "../utils/config.js";

export async function setGradeRestriction(data){
    try {
        let test = {
            "grade_9": true,
            "grade_10": false,
            "grade_11": false,
            "grade_12": false
        }
        await editConfig('enabled_grades', test);
        console.log(JSON.parse(test));
    }catch (err){
        return false;
    }
    return true;
}