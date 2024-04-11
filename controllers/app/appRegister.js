//all regestration logic will go on here

import { User } from "../../models/user.js";
import { Locker } from "../../models/locker.js";

import { Op } from "sequelize";



export async function registerUserToLocker(data) {
    //studentID, building, floor, level


    let students = data.students;
    let location = data.location;


    //todo run a ton of data checks here, this is critical logic that will inevitably break
    // - check if there are allready people in a locker > 2


    let lockerArray = await Locker.findAll({
        where: {
            "location.Building": { [Op.eq]: location.building },
            "location.Floor": { [Op.eq]: location.floor },
            "location.Level": { [Op.eq]: location.level },
        }
    });



    const filteredLockers = lockerArray.filter(locker => locker.users.length <= 1); //check for standard lockers, needs to check less than 0 for single lockers

    console.log(filteredLockers);

    //todo write some logic to do something if lockerArray is empty (no lockers avalible in the selected area)

    let selectedLocker = filteredLockers[0]; //todo find a better way to select lockers, this would work but seems kinda low tech 

    for (let student of students) {
        let selectedUser = await User.findByPk(student);

        selectedUser.setLocker(selectedLocker)
            .catch((error) => {
                console.log(error);
                return false;
            });
    }
    return true;
}