const { GraphQLList, GraphQLID } = require("graphql");

const MessageType = require("../types/Message");
const MessageModel = require("../../database/models/Message");

const MessageQuery = {
    messages: {
        type: new GraphQLList(MessageType),
        async resolve(_parent, _args) {
            return await MessageModel.find();
            // .populate('sender');
        }
    },
    message: {
        type: MessageType,
        args: { 
            id: { type:GraphQLID }
        },
        async resolve(_parent, args) {
            return await MessageModel.findById(args.id);
            // .populate('sender');
        }
    }
}

module.exports = MessageQuery;