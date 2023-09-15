import {createUser, validateUser, getId, getUser, getUserfromId} from './controllers/admin.js'
// let user = await createUser('test','test')
let user = await getUser('test');
// let user = await validateUser('birdpump', 'test')
console.log(user);