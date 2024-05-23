import {sequelize} from "../config/sequelize.js";
import {DataTypes} from "sequelize";


const Config = sequelize.define('Config', {
    key: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
    },
    value: {
        type: DataTypes.JSON,
        allowNull: false,
    },
});

export {Config};
