import { sequelize } from "../config/sequelize.js";
import { Sequelize, DataTypes } from "sequelize";


const verificationQueue = sequelize.define('verificationQueue', {
    uuid:{
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    studentId: {
        type: DataTypes.INTEGER,
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

});

export {verificationQueue};
