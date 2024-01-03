import {createConfig, readConfig, editConfig} from "../utils/config.js";

export async function setGradeRestriction(data){
    try {
        console.log(JSON.parse(data));
        let test = {
            "grade_9": true,
            "grade_10": false,
            "grade_11": false,
            "grade_12": false
        }
        console.log(test)
        await editConfig('enabled_grades', test);

    }catch (err){
        return false;
    }
    return true;
}