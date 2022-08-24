const {
    GraphQLObjectType, 
    GraphQLID, 
    GraphQLString, 
    GraphQLList
} = require('graphql');

// import unions
const SenderUnion = require('./helpers/SenderUnion');
const ReplyUnion = require('./helpers/ReplyUnion');

const MessageType = new GraphQLObjectType({
    name: 'MessageType',
    fields: () => ({
        id: {
            type: GraphQLID 
        },
        sender: {
            type: SenderUnion,
        },
        sender_on_model: {
            type: GraphQLString 
        },
        reply: {
            type: ReplyUnion,
        },
        reply_on_model: {
            type: GraphQLString,
        },
        tags: {
            type: new GraphQLList(GraphQLString),
        },
        body: {
            type: GraphQLString 
        },
    }),
});

const StartMessageType = new GraphQLObjectType({
    name:"PrevMessageType",
    fields: () => ({
        id: {
            type: GraphQLID 
        },
        sender: {
            type: SenderUnion,
        },
        sender_on_model: {
            type: GraphQLString 
        },
        reply: {
            type: ReplyUnion,
        },
        reply_on_model: {
            type: GraphQLString,
        },
        tags: {
            type: new GraphQLList(GraphQLString),
        },
        body: {
            type: GraphQLString 
        },

    })
})

module.exports = MessageType;