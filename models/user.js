import { sequelize } from "../config/sequelize.js";
import { Sequelize, DataTypes } from "sequelize";


const User = sequelize.define('User', {
    // Define user attributes (e.g., name, email, etc.)
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    // Add any other user attributes you need
});

export default User;
