import { sequelize } from "../config/sequelize.js";
import { Sequelize, DataTypes } from "sequelize";


const Config = sequelize.define('Config', {
    key: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
    },
    value: {
        type: DataTypes.JSON,
        allowNull: false,
    },
});

export {Config};
