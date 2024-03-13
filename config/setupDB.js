import {createAdminUser} from "../controllers/admin/adminUser.js";
import {createLocker, createUser, joinUsertoLocker} from "../controllers/app/appData.js";
import {createConfig, readConfig} from "../utils/admin/configManager.js";

//TODO will set root user from environment variables
//todo check if db is null only run if null

export async function addTestUsers() {
    try {
        await createAdminUser('birdpump', 'test')

        await createUser(415633, 'marc test', 9, 'ashl3452@stu.gusd.net')

        await createUser(415631, 'marc hyeler', 10, 'mhye5631@stu.gusd.net')

        await createLocker('2024', {"building": 2000, "level": 0, "floor": 2})

        await joinUsertoLocker(415633, '2024');

        await joinUsertoLocker(415631, '2024');
    } catch (err) {
        console.log("sync-err")
    }

}


export async function setDefaultConfigs() {
    const grades = {
        grade_12: false,
        grade_11: false,
        grade_10: false,
        grade_9: false,
    }
    if (await readConfig('enabled_grades') === false) await createConfig('enabled_grades', grades);
    //todo in order for locker selection to work, this needs to be in the same format as the existing model
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
    }
    if (await readConfig('restricted_areas') === false) await createConfig('restricted_areas', areas)
}