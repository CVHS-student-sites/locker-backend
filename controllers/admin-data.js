import {createConfig, readConfig, editConfig} from "../utils/config.js";

export async function setGradeRestriction(data){
    try {
        let test = {
            "grade_9": true,
            "grade_10": false,
            "grade_11": false,
            "grade_12": false
        }
        let demo = await editConfig('enabled_grades', data);
        console.log(demo)
        if(demo) return true;

    }catch (err){
        return false;
    }
}