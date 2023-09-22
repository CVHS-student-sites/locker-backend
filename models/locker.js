import { sequelize } from "../config/sequelize.js";
import { Sequelize, DataTypes } from "sequelize";
import { User } from './user.js';

const Locker = sequelize.define('Locker', {
  lockerNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },

  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  status:{
    type: DataTypes.INTEGER,
    allowNull: true,
  }
  // Add any other locker attributes you need
});

Locker.hasMany(User);
User.belongsTo(Locker);


export {Locker};
