const {
    GraphQLObjectType, 
    GraphQLID, 
    GraphQLString, 
} = require('graphql');

const TechnicianType = new GraphQLObjectType({
    name: 'TechnicianType',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
    }),
});

const TechnicianAuthPayloadType = new GraphQLObjectType({
    name: 'TechnicianAuthPayloadType',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
        token: { type: GraphQLString },
    }),
});

module.exports = { TechnicianType, TechnicianAuthPayloadType };