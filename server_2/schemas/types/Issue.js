const {
    GraphQLObjectType, 
    GraphQLID, 
    GraphQLString, 
    GraphQLUnionType,
} = require('graphql');

const Client = require('../../database/models/Client');
const ClientType = require('./Client');

const Agent = require('../../database/models/Agent');
const AgentType = require('./Agent');

const IssueSenderUnion = new GraphQLUnionType({
    name: 'IssueSenderUnion',
    types: [ ClientType, AgentType ],
    resolveType(value) {
        if (value instanceof Agent) {
            return 'AgentType';
        } else {
            return 'ClientType';
        }
    }
});

const IssueType = new GraphQLObjectType({
    name: 'IssueType',
    fields: () => ({
        id: { type: GraphQLID },
        sender: {
            type: IssueSenderUnion,
        },
        sender_on_model: { type: GraphQLString },
        status: { type: GraphQLString },
        body: { type: GraphQLString },
    }),
});

module.exports = IssueType;