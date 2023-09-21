import { sequelize } from "../config/sequelize.js";
import { Sequelize, DataTypes } from "sequelize";
import { User } from './user.js';

const Locker = sequelize.define('Locker', {
  // Define locker attributes (e.g., locker number, location, etc.)
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
  // Add any other locker attributes you need
});

// Define the association between User and Locker
// Define the association between User and Locker
Locker.hasMany(User);
User.belongsTo(Locker);


export {Locker};
