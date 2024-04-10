//all regestration logic will go on here

import { User } from "../../models/user.js";
import { Locker } from "../../models/locker.js";


export async function registerUserToLocker(studentID, building, floor, level) {

    //todo run a ton of data checks here, this is critical logic that will inevitably break
    let lockerArray = await Locker.findAll({
        where: {
            "location.Building": { [Op.eq]: building },
            "location.Floor": { [Op.eq]: floor },
            "location.Level": { [Op.eq]: level },
        }
    });

    //todo write some logic to do something if lockerArray is empty (no lockers avalible in the selected area)

    let selectedLocker = lockerArray[0]; //todo find a better way to select lockers, this would work but seems kinda low tech 

    let selectedUser = await User.findByPk(studentID);
 
    selectedUser.setLocker(selectedLocker)
        .then(() => {
            console.log("User has been associated with the locker.");

            return true;
        })
        .catch((error) => {
            console.log(error);
            return false;
        });






    console.log(lockerArray);



}