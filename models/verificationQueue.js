import { sequelize } from "../config/sequelize.js";
import { Sequelize, DataTypes } from "sequelize";


const verificationQueue = sequelize.define('verificationQueue', {
    studentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    uuid:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
});

export {verificationQueue};
