import {createAdminUser} from "../controllers/admin.js";
import {createLocker, createUser, joinUsertoLocker} from "../controllers/user-locker.js";
import {createConfig} from "../utils/config.js";

//TODO will set root user from environment variables
export async function addTestUsers(){
    await createAdminUser('birdpump','test')

    await createUser(415633, 'marc test', 'as@stu.gusd.net')

    await createUser(415631, 'marc hyeler', 'ashashas@stu.gusd.net')

    await createLocker('73-13A', {"building": 2, "row": 8})

    await joinUsertoLocker(415633, '73-13A');

    await joinUsertoLocker(415631, '73-13A');
}

//todo check if db is null only run if null
export async function setDefaultConfigs(){
    const grades = {
        grade_12: false,
        grade_11: false,
        grade_10: false,
        grade_9: false,
    }
    await createConfig('enabled_grades', grades)

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
    await createConfig('restricted_areas', areas)

}