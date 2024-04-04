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
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    expiration:{
        type: DataTypes.DATE,
        allowNull: false,
    }

});

export {verificationQueue};
