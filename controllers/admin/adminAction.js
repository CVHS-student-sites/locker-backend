// used for admin routes that need to change system configs and settings and system events

import {createConfig, readConfig, editConfig} from "../../utils/admin/configManager.js";

export async function setGradeRestriction(data) {
    try {
        if (await editConfig('enabled_grades', data)) return true;

    } catch (err) {
        return false;
    }
}

export async function setAreaRestriction(data) {
    try {
        if (await editConfig('restricted_areas', data)) return true;

    } catch (err) {
        return false;
    }
}