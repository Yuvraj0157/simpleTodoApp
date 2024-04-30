const sequelize = require("../utils/connection");
const { Sequelize, DataTypes } = require('sequelize');
const User = require("./user");
const { on } = require("nodemailer/lib/xoauth2");

const Todo = sequelize.define(
  "todo",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    task: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    due: {
      type: DataTypes.DATEONLY,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
  }
);

Todo.belongsTo(User, {
  foreignKey: {
    name: "userID",
  },
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT"
});

module.exports = Todo;
