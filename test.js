import { createUser, validateUser, getId } from './controllers/admin.mjs'

let user = await getId('test');
// let user = await validateUser('test', 'admin')
console.log(user);