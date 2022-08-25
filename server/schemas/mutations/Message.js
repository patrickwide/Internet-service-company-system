const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLEnumType,
  GraphQLList,
} = require("graphql");
const mongoose = require("mongoose");

// import message model
const Message = require("../../database/models/Message");
// import message type
const MessageType = require("../types/Message");

// import models
const Client = require("../../database/models/Client");
const Admin = require("../../database/models/Admin");
const Agent = require("../../database/models/Agent");
const Technician = require("../../database/models/Technician");
const Issue = require("../../database/models/Issue");
const Ticket = require("../../database/models/Ticket");

// import auth
const authenticateUser = require("../auth/");

const MessageMutation = {
  // add message
  addMessage: {
    type: MessageType,
    args: {
      primary_reply: { type: new GraphQLNonNull(GraphQLString) },
      secondary_reply: { type: GraphQLString },
      tags: { type: new GraphQLList(GraphQLString) },
      body: { type: new GraphQLNonNull(GraphQLString) },
    },
    async resolve(_parent, args, context) {
      // A list of models(users) that are allowed for this request
      const allowedUserModels = [Admin, Agent, Client, Technician];

      // authenticate the user
      const authenticatedUser = await authenticateUser(
        allowedUserModels,
        context
      );

      // if user is authenticated
      if (authenticatedUser === 1) {
        throw new Error("User is not authentiacted.");
      }

      // if authenticated user is allowed for this request
      if (authenticatedUser === 2) {
        throw new Error("User is not authorized for this request.");
      }

      // A list of models(resorce) that are allowed for this request
      const allowedReplyModels = [Message, Issue, Ticket];

      // check ...
      const allowedReply = await getAllowReply(
        allowedReplyModels,
        args.primary_reply
      );

      if (allowedReply === 1) {
        throw new Error("The message does not exists.");
      }

      const message = await new Message({
        sender: authenticatedUser.authenticatedUser._id,
        sender_on_model: authenticatedUser.authenticateduserOnModel,
        primary_reply: allowedReply.allowedReply._id,
        primary_reply_on_model: allowedReply.allowedReplyOnModel,
        secondary_reply: args.secondary_reply,
        tags: args.tags,
        body: args.body,
      }).save();

      return message.populate(["sender", "primary_reply"]);
    },
  },
  // delete message
  deleteMessage: {
    type: MessageType,
    args: {
      id: { type: GraphQLID },
    },
    async resolve(_parent, args, context) {
      // A list of models(users) that are allowed for this request
      const allowedUsers = [Admin, Agent, Client, Technician];

      // authenticate the user
      const authenticatedUser = await authenticateUser(allowedUsers, context);

      // if user is authenticated (The token is not available)
      if (authenticatedUser === 1) {
        throw new Error("User is not authentiacted.");
      }

      // if authenticated user is allowed for this request (Users token is not authorized for this request)
      if (authenticatedUser === 2) {
        throw new Error("User is not authorized for this request.");
      }

      // check if user did post the message
      const message = await Message.findById(args.id);
      if (
        authenticatedUser.authenticatedUser._id.toString() !==
        message.sender.toString()
      ) {
        throw new Error("User is not authorized for this request.");
      }

      return await Message.findByIdAndRemove(args.id).populate([
        "sender",
        "primary_reply",
      ]);
    },
  },
  // update message
  updateMessage: {
    type: MessageType,
    args: {
      primary_reply: { type: GraphQLString },
      secondary_reply: { type: GraphQLString },
      tags: { type: new GraphQLList(GraphQLString) },
      body: { type: GraphQLString },
    },
    async resolve(_parent, args, context) {
      // A list of models(users) that are allowed for this request
      const allowedUsers = [Admin, Agent, Client, Technician];

      // authenticate the user
      const authenticatedUser = await authenticateUser(allowedUsers, context);

      // if user is authenticated
      if (authenticatedUser === 1) {
        throw new Error("User is not authentiacted.");
      }

      // if authenticated user is allowed for this request
      if (authenticatedUser === 2) {
        throw new Error("User is not authorized for this request.");
      }

      // check if user did post the message
      const message = await Message.findById(args.id);
      if (
        authenticatedUser.authenticatedUser._id.toString() !==
        message.sender.toString()
      ) {
        throw new Error("User is not authorized for this request.");
      }

      // A list of models(resorce) that are allowed for this request
      const allowedReplyModels = [Message, Issue, Ticket];

      // check ...
      const allowedReply = allowedReplyModels(
        allowedReplyModels,
        args.primary_reply
      );
      if (allowedReply === 1) {
        throw new Error("The message does not exists.");
      }

      return await Message.findByIdAndUpdate(
        args.id,
        {
          $set: {
            sender: authenticatedUser.authenticatedUser._id,
            sender_on_model: authenticatedUser.authenticateduserOnModel,
            primary_reply: allowedReply.allowedReply._id,
            primary_reply_on_model: allowedReply.allowedReplyOnModel,
            secondary_reply: args.secondary_reply,
            tags: args.tags,
            body: args.body,
          },
        },
        { new: true }
      ).populate(["sender", "primary_reply"]);
    },
  },
};

async function getAllowReply(models, replyId) {
  for (
    let i = 0, allowedModelsLength = models.length;
    i < allowedModelsLength;
    i++
  ) {
    const model = models[i];
    const allowedReply = await model.findById(replyId);
    if (allowedReply !== null) {
      const allowedReplyOnModel = model().constructor.modelName;
      return {
        allowedReply,
        allowedReplyOnModel,
      };
    }
  }
  // the resorce does not exists.
  return 1;
}

module.exports = MessageMutation;
