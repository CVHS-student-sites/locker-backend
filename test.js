import { createUser, validateUser, getId } from './controllers/admin.js'
let user = await createUser('birdpump','test')
// let user = await getId('test');
// let user = await validateUser('test', 'admin')
console.log(user);