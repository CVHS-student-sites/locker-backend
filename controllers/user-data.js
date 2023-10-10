//TODO write logic to import from csv
export async function createLocker(lockerNumber, location) {
    try {
        let locker = await Locker.create({
            lockerNumber: lockerNumber,
            location: location,
        });
        return locker;
    } catch (err) {
        return false;
    }
}