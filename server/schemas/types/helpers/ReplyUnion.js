const {
    GraphQLUnionType,
    GraphQLObjectType
} = require("graphql");

const MessageModel = require("../../../database/models/Message");
const MessageType = require("../Message");

const IssueModel = require("../../../database/models/Issue");
const IssueType = require("../Issue");

const TicketModel = require("../../../database/models/Ticket");
const TicketType = require("../Ticket");

const ReplyUnion = new GraphQLUnionType({
    name: 'ReplyUnion',
    types:[ MessageType, IssueType, TicketType ],
    resolveType(value) {
        if (value instanceof MessageModel) {
            return 'MessageType';
        } else if (value instanceof IssueModel) {
            return 'IssueType';
        } else if (value instanceof TicketModel) {
            return 'TicketType';
        }
    }
});

module.exports = ReplyUnion;