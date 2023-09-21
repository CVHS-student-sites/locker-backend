import { sequelize } from "../config/sequelize.js";
import { Sequelize, DataTypes } from "sequelize";
import User from "./user.js";

const Locker = sequelize.define('Locker', {
  // Define locker attributes (e.g., locker number, location, etc.)
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  lockerNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Add any other locker attributes you need
});

// Define the association between User and Locker
User.hasOne(Locker);
Locker.belongsTo(User);

export {Locker};
