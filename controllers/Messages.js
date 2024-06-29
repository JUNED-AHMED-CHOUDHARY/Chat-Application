const User = require("../models/User");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const { getReceiverSocketId, io } = require("../socket/socket");

exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id } = req.params;

    const senderId = req.user.user_id;

    const receiverId = id;

    console.log("field -> ", message, id, senderId, receiverId);

    if (!senderId || !receiverId || !message) {
      return res.status(400).json({
        success: false,
        message: `all fields are required to send the mail`,
      });
    }

    const checkSenderExists = await User.findById(senderId);

    const checkRecieverExists = await User.findById(receiverId);

    if (!checkSenderExists || !checkRecieverExists) {
      return res.status(404).json({
        success: false,
        message: `sender or receiver user is not valid`,
      });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }


    await conversation.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    } 



    return res.status(200).json({
      success: true,
      message: newMessage,
      conversation: conversation,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `error while sending message = ${err.message}`,
    });
  }
};

exports.getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;

    const senderId = req.user.user_id;

    console.log("all good", userToChatId, senderId);
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");
    console.log("all clear");

    if (!conversation) {
      return res.status(200).json({
        success: true,
        messages: [],
      });
    }

    const messages = conversation.messages;

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `error while getting all the messages ${err.message}`,
    });
  }
};
