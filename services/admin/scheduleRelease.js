import schedule from "node-schedule";
import {readConfig} from "../../utils/admin/config/configManager.js";
import {setGradeRestriction} from "../../controllers/admin/adminAction.js";

// automatically turns on registration if time is right
export function scheduleAutoRelease() {
    schedule.scheduleJob('*/10 * * * * *', async function () {
        const now = new Date();

        let autoEnabled = await readConfig('enable_auto_release');
        console.log(autoEnabled);

        if (autoEnabled.enabled) {
            console.log("autoEnabled auto release active");
            let dates = await readConfig('auto_release_dates');
            let dateObjects = {
                preRegister: new Date(dates.preRegister),
                grade12: new Date(dates.grade12),
                grade11: new Date(dates.grade11),
                grade10: new Date(dates.grade10),
                grade9: new Date(dates.grade9),
            }

            let enabledGrades = {
                preReg: (dateObjects.preRegister < now),
                grade_9: (dateObjects.grade9 < now),
                grade_10: (dateObjects.grade10 < now),
                grade_11: (dateObjects.grade11 < now),
                grade_12: (dateObjects.grade12 < now),
            }

            await setGradeRestriction(enabledGrades);
        }
    });
}
