const {
    GraphQLObjectType, 
    GraphQLID, 
    GraphQLString, 
} = require('graphql');

const SenderUnion = require("./helpers/SenderUnion");

const IssueType = new GraphQLObjectType({
    name: 'IssueType',
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
        status: { 
            type: GraphQLString 
        },
        body: { 
            type: GraphQLString 
        },
    }),
});

module.exports = IssueType;