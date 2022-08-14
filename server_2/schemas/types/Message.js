const {
    GraphQLObjectType, 
    GraphQLID, 
    GraphQLString, 
    GraphQLUnionType
} = require('graphql');

const IssueModel = require('../../database/models/Issue');
const IssueType = require('./Issue');
const MessageModel = require('../../database/models/Message');
const SenderUnion = require('./helpers/SenderUnion');

const MessageType = new GraphQLObjectType({
    name: 'MessageType',
    fields: () => ({
        id: { type: GraphQLID },
        sender: { 
            type: SenderUnion 
        },
        issue: {
            type: IssueType,
            resolve(parent, _args) {
                return IssueModel.findById(parent.issue).populate("sender");
            }
        },
        reply_to: {
            type: MessageType,
            resolve(parent, _args) {
                return MessageModel.findById(parent.reply_to);
            }
        },
        body: { type: GraphQLString },
    }),
});

module.exports = MessageType;