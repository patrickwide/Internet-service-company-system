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

module.exports = AgentType;