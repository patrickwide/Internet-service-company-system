const {
    GraphQLObjectType, 
    GraphQLID, 
    GraphQLString, 
} = require('graphql');

const Client = require('../../database/models/Client');
const ClientType = require('./Client');


const IssueType = new GraphQLObjectType({
    name: 'IssueType',
    fields: () => ({
        id: { type: GraphQLID },
        sender: {
            type: ClientType,
            resolve(parent, _args) {
                return Client.findById(parent.sender_id);
            }
        },
        status: { type: GraphQLString },
        body: { type: GraphQLString },
    }),
});

module.exports = IssueType;