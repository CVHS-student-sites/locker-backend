import schedule from "node-schedule";
import {verificationQueue} from "../../models/verificationQueue.js";
import {Op} from "sequelize";

export function scheduleVerificationJob() {
    schedule.scheduleJob('*/1 * * * *', async function () {
        console.log('The answer to life, the universe, and everything!');

        const now = new Date();

        await verificationQueue.destroy({
            where: {
                expiration: {
                    [Op.lt]: now
                }
            }
        });
    });
}
