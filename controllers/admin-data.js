import {createConfig, readConfig, editConfig} from "../utils/config.js";

export async function setGradeRestriction(data){
    await editConfig('enabled_grades', JSON.parse(data));
}