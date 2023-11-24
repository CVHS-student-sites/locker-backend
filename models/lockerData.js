import { sequelize } from "../config/sequelize.js";
import { Sequelize, DataTypes } from "sequelize";


const LockerData = sequelize.define('LockerData', {
    lockerNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    location: {
        type: DataTypes.JSON,
        allowNull: true,
    }
    // Add any other locker attributes you need
});

export {LockerData};
