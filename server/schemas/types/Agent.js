const {
    GraphQLObjectType, 
    GraphQLID, 
    GraphQLString, 
} = require('graphql');

const AgentType = new GraphQLObjectType({
    name: 'AgentType',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
    }),
});

const AgentAuthPayloadType = new GraphQLObjectType({
    name: 'AgentAuthPayloadType',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
        token: { type: GraphQLString },
    }),
});

module.exports = { AgentType, AgentAuthPayloadType };