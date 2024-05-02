import schedule from "node-schedule";
import {verificationQueue} from "../../models/verificationQueue.js";
import {Op} from "sequelize";

//removes expired verification requests from verification queue every 1 minute
export function scheduleVerificationJob() {
    schedule.scheduleJob('*/1 * * * *', async function () {
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
