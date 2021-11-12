const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");
const { parseConversations } = require("../../utils/parseCoversations")

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id"],
      order: [[Message, "createdAt", "ASC"]],
      include: [
        {
          model: Message,
        },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    const parsedConvo = await parseConversations(conversations, onlineUsers, userId)
    await res.json(parsedConvo);

  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        id: req.params.id,
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id"],
      order: [[Message, "createdAt", "ASC"]],
      include: [
        {
          model: Message,
        },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    const parsedConvo = await parseConversations(conversations, onlineUsers, userId)
    await res.json(parsedConvo);
  } catch (error) {
    next(error)
  }
})

router.put("/:id", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const conversation = await Conversation.findByPk(req.params.id)
    const userId = req.user.toJSON().id

    if (userId !== conversation.toJSON().user1Id && userId !== conversation.toJSON().user2Id) {
      return res.sendStatus(403)
    }

    const messages = await Message.update(
      {
        readByReceiver: true
      },
      {
        where: {
          conversationId: req.params.id,
          senderId: req.body.senderId
        },
      })

    await res.json(messages);
  } catch (error) {
    next(error);
  }
})

module.exports = router;
