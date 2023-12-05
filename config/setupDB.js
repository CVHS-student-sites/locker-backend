import {createAdminUser} from "../controllers/admin.js";
import {createLocker, createUser, joinUsertoLocker} from "../controllers/user-locker.js";

export async function addTestUsers(){
    await createAdminUser('birdpump','test')

    await createUser(415633, 'marc test', 'as@stu.gusd.net')

    await createUser(415631, 'marc hyeler', 'ashashas@stu.gusd.net')

    await createLocker('73-13A', {"building": 2, "row": 8})

    await joinUsertoLocker(415633, '73-13A');

    await joinUsertoLocker(415631, '73-13A');
}
