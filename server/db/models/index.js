const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const Partaker = require("./partakers");
const Receiver = require("./receivers");

// associations

User.hasMany(Conversation);
Conversation.belongsTo(User, { as: "user1" });
Conversation.belongsTo(User, { as: "user2" });
Message.belongsTo(Conversation);
Conversation.hasMany(Message);
User.hasMany(Partaker);
Partaker.belongsTo(User);
Partaker.belongsTo(Conversation);
User.hasMany(Receiver);
Receiver.belongsTo(User);
Receiver.belongsTo(Message);
Message.hasMany(Receiver)

module.exports = {
  User,
  Conversation,
  Message
};
