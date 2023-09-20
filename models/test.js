import {sequelize} from "../config/sequelize.js";
import {Sequelize, DataTypes} from "sequelize";


const User = sequelize.define('User', {
    studentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },

    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    }
});


const Locker = sequelize.define('Locker', {
    lockerId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
});


