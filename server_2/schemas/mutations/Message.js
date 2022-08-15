const { 
    GraphQLNonNull, 
    GraphQLString, 
    GraphQLID,
    GraphQLEnumType,
    GraphQLList,
} = require("graphql");
const MessageModel = require("../../database/models/Message");
const MessageType = require("../types/Message");
const mongoose = require("mongoose");

// import models
const Client = require("../../database/models/Client");
const Admin = require("../../database/models/Admin");
const Agent = require("../../database/models/Agent");
const Technician = require("../../database/models/Technician");
// import auth
const authenticateUser = require("../auth/");

const MessageMutation = {
    // add message
    addMessage: {
        type: MessageType,
        args: {
            issue: { type: new GraphQLNonNull(GraphQLString) },
            reply_to: { type: GraphQLString },
            body: { type: new GraphQLNonNull(GraphQLString) },
            tags: { type: new GraphQLList(GraphQLString) },
        },
        async resolve(_parent, args, context) {
            
            // A list of models(users) that are allowed for this request
            const allowedUsers = [ Admin,Agent,Client,Technician ];
            
            // authenticate the user
            const authenticatedUser = await authenticateUser(allowedUsers, context);

            // if user is authenticated
            if (authenticatedUser === 1) {
                throw new Error("User is not authentiacted.");
            }

            // if authenticated user is allowed for this request
            if (authenticatedUser === 2 ) {
                throw new Error("User is not authorized for this request.");
            } 
            

            let message;
            const session = await mongoose.startSession();
            try {
                session.startTransaction();
                message = new MessageModel({
                    sender: authenticatedUser.authenticatedUser._id,
                    sender_on_model: authenticatedUser.authenticateduserOnModel,
                    issue: args.issue,
                    reply_to: args.reply_to,
                    body: args.body,
                    tags: args.tags,
                });
                await message.save();
                session.commitTransaction();
            } catch (error) {
                session.abortTransaction();
                throw error;
            }
            session.endSession();
            return message.populate('sender');
        }
    },
    // delete message
    deleteMessage: {
        type: MessageType,
        args: {
            id: { type: GraphQLID }
        },
        async resolve(_parent, args, context) {
            // A list of models(users) that are allowed for this request
            const allowedUsers = [ Admin,Agent,Client,Technician ];
            
            // authenticate the user
            const authenticatedUser = await authenticateUser(allowedUsers, context);

            // if user is authenticated (The token is not available)
            if (authenticatedUser === 1) {
                throw new Error("User is not authentiacted.");
            }

            // if authenticated user is allowed for this request (Users token is not authorized for this request)
            if (authenticatedUser === 2 ) {
                throw new Error("User is not authorized for this request.");
            } 

            // check if user did post the message
            const message = await MessageModel.findById(args.id);
            if (authenticatedUser.authenticatedUser._id.toString() !== message.sender.toString()) {
                throw new Error("User is not authorized for this request.");
            }

            return MessageModel.findByIdAndRemove(args.id).populate("sender");
        },
    },
    // update message
    updateMessage: {
        type: MessageType,
        args: {
            id: { type: GraphQLID },
            issue: { type: GraphQLString },
            reply_to: { type: GraphQLString },
            body: { type: GraphQLString },
            tags: { type: new GraphQLList(GraphQLString) },
        },
        async resolve(_parent, args, context) {
            // A list of models(users) that are allowed for this request
            const allowedUsers = [ Admin,Agent,Client,Technician ];
            
            // authenticate the user
            const authenticatedUser = await authenticateUser(allowedUsers, context);

            // if user is authenticated
            if (authenticatedUser === 1) {
                throw new Error("User is not authentiacted.");
            }

            // if authenticated user is allowed for this request
            if (authenticatedUser === 2 ) {
                throw new Error("User is not authorized for this request.");
            } 

            // check if user did post the message
            const message = await MessageModel.findById(args.id);
            if (authenticatedUser.authenticatedUser._id.toString() !== message.sender.toString()) {
                throw new Error("User is not authorized for this request.");
            }

            return await MessageModel.findByIdAndUpdate(
                args.id,
                {
                    $set: {
                        issue: args.issue,
                        reply_to: args.reply_to,
                        body: args.body,
                        tags: args.tags,
                    },
                },
                { new: true },
            ).populate("sender");
        },
    },
};

module.exports = MessageMutation;