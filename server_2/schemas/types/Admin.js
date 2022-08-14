const {
    GraphQLObjectType, 
    GraphQLID, 
    GraphQLString, 
} = require('graphql');

const AdminType = new GraphQLObjectType({
    name: 'AdminType',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
    }),
});

const AdminAuthPayloadType = new GraphQLObjectType({
    name: 'AdminAuthPayloadType',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
        token: { type: GraphQLString },
    }),
});


module.exports = { AdminType, AdminAuthPayloadType };
