import {createConfig, readConfig, editConfig} from "../utils/config.js";

export async function setGradeRestriction(data){
    try {
        await editConfig('enabled_grades', JSON.parse(data));
        console.log(JSON.parse(data))
    }catch (err){
        return false;
    }
    return true;
}