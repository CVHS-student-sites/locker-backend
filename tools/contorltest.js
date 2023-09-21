import { createUser, createLocker, createUserjoinLocker, getUser, getLocker, joinUsertoLocker } from "../controllers/user-locker.js";

import { validateUser, getId, getUser, getUserfromId} from '../controllers/admin.js'


// admin controllers

// let user = await createUser('birdpump','test')

// let user = await getUser('test');

// let user = await validateUser('birdpump', 'test')

// console.log(user);



// student controllers

let tesst = await createUser(415633, 'marc test', 'as@stu.gusd.net')

let tessst = await createLocker('73-13A', '7000')

let test = await joinUsertoLocker(415633, '73-13A');

// let test = await getUser(415633)

// let test = await getLocker('73-13A')

console.log(test)