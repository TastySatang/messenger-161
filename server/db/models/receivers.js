const Sequelize = require("sequelize");
const db = require("../db");

const Receiver = db.define("receiver", {
  readByReceiver: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = Receiver;
