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

const MessageMutation = {
    // add message
    addMessage: {
        type: MessageType,
        args: {
            sender: { type: new GraphQLNonNull(GraphQLString) },
            sender_on_model: { 
                type: new GraphQLEnumType({
                    name: 'SenderOnModel',
                    values: {
                        client: { value: 'Client' },
                        agent: { value: 'Agent' },
                        admin: { value: 'Admin' },
                        technician: { value: 'Technician' },
                    },
                }) 
            },
            issue: { type: new GraphQLNonNull(GraphQLString) },
            reply_to: { type: GraphQLString },
            body: { type: new GraphQLNonNull(GraphQLString) },
            tags: { type: new GraphQLList(GraphQLString) },
        },
        async resolve(_parent, args) {
            let message;
            const session = await mongoose.startSession();
            try {
                session.startTransaction();
                message = new MessageModel({
                    sender: args.sender,
                    sender_on_model: args.sender_on_model,
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
        async resolve(_parent, args) {
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
        async resolve(_parent, args) {
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