import schedule from "node-schedule";
import {verificationQueue} from "../../models/verificationQueue.js";


const job = schedule.scheduleJob('*/1 * * * *', function () {
    console.log('The answer to life, the universe, and everything!');

});
