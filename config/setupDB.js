import {createAdminUser} from "../controllers/admin/adminUser.js";
import {createConfig, readConfig} from "../utils/admin/config/configManager.js";


//todo check if db is null only run if null
export async function addRootUsers() {
    try {
        await createAdminUser(process.env.UIADMINUSER, process.env.UIADMINPASSWORD);
    } catch (err) {
        console.log("sync-err");
    }

}


export async function setDefaultConfigs() {
    //todo rename grades to something else later
    const grades = {
        grade_12: false,
        grade_11: false,
        grade_10: false,
        grade_9: false,
        preReg: false,

    };
    if (await readConfig('enabled_grades') === false) await createConfig('enabled_grades', grades);

    const areas = {
        building_1000: {
            floor_1: false,
            floor_3: false,
        },
        building_2000: {
            floor_1: false,
            floor_2: false,
            floor_3: false,
        },
        building_5000: {
            floor_2: false,
            floor_3: false,
        },
        building_7000: {
            floor_1: false,
            floor_2: false,
            floor_3: false,
        },
    };
    if (await readConfig('restricted_areas') === false) await createConfig('restricted_areas', areas);
}