import {createAdminUser} from "../controllers/admin/adminUser.js";
import {createLocker, createUser, joinUsertoLocker} from "../controllers/app/appData.js";
import {createConfig, readConfig} from "../utils/admin/configManager.js";

//TODO will set root user from environment variables
export async function addTestUsers() {
    try {
        await createAdminUser('birdpump', 'test')

        await createUser(415633, 'marc test', 'as@stu.gusd.net')

        await createUser(415631, 'marc hyeler', 'ashashas@stu.gusd.net')

        await createLocker('73-13A', {"building": 2, "row": 8})

        await joinUsertoLocker(415633, '73-13A');

        await joinUsertoLocker(415631, '73-13A');
    } catch (err) {
        console.log("sync-err")
    }

}

//todo check if db is null only run if null
export async function setDefaultConfigs() {
    const grades = {
        grade_12: false,
        grade_11: false,
        grade_10: false,
        grade_9: false,
    }
    if (await readConfig('enabled_grades') === null) await createConfig('enabled_grades', grades);

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
    if (await readConfig('restricted_areas') === null) await createConfig('restricted_areas', areas)
}