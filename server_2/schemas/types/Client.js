const {
    GraphQLObjectType, 
    GraphQLID, 
    GraphQLString, 
} = require('graphql');

const ClientType = new GraphQLObjectType({
    name: 'ClientType',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
    }),
});

const ClientAuthPayloadType = new GraphQLObjectType({
    name: 'ClientAuthPayloadType',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
        token: { type: GraphQLString },
    }),
});


module.exports = { 
    ClientType, 
    ClientAuthPayloadType,
};
