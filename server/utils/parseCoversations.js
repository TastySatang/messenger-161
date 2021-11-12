const { Message, Conversation } = require("../db/models")
const { Op } = require("sequelize");

const parseConversations = async (payload, onlineUsers, userId) => {
  const conversations = payload

  for (let i = 0; i < conversations.length; i++) {
    const convo = conversations[i];
    const convoJSON = convo.toJSON();

    // set a property "otherUser" so that frontend will have easier access
    if (convoJSON.user1) {
      convoJSON.otherUser = convoJSON.user1;
      delete convoJSON.user1;
    } else if (convoJSON.user2) {
      convoJSON.otherUser = convoJSON.user2;
      delete convoJSON.user2;
    }

    // set property for online status of the other user
    if (onlineUsers.includes(convoJSON.otherUser.id)) {
      convoJSON.otherUser.online = true;
    } else {
      convoJSON.otherUser.online = false;
    }

    // set properties for notification count and latest message preview
    convoJSON.latestMessageText = convoJSON.messages[convoJSON.messages.length - 1].text;
    convoJSON.latestMessageTime = convoJSON.messages[convoJSON.messages.length - 1].createdAt;

    const unreadCount = await Message.count({
      where: {
        conversationId: convoJSON.id,
        readByReceiver: false,
        senderId: {
          [Op.not]: userId
        }
      }
    })

    const lastReadMessageId = await Message.max('id', {
      where: {
        conversationId: convoJSON.id,
        readByReceiver: true,
        senderId: userId,

      }
    })

    convoJSON.unreadCounter = unreadCount
    convoJSON.lastMessageReadId = lastReadMessageId

    conversations[i] = convoJSON;
  }

  conversations.sort((a, b) => b.latestMessageTime - a.latestMessageTime)

  return conversations
}

module.exports = {
  parseConversations,
}
