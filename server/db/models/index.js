const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const Partaker = require("./partakers");
const Receiver = require("./receivers");

// associations

User.belongsToMany(Conversation, { through: Partaker });
Conversation.belongsToMany(User, { through: Partaker })
Conversation.belongsTo(User, { as: "user1" });
Conversation.belongsTo(User, { as: "user2" });
Message.belongsTo(Conversation);
Conversation.hasMany(Message);
User.belongsToMany(Message, { through: Receiver });
Message.belongsToMany(User, { through: Receiver })

module.exports = {
  User,
  Conversation,
  Message
};
