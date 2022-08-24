const {
    GraphQLObjectType, 
    GraphQLID, 
    GraphQLString, 
} = require('graphql');

const Agent = require('../../database/models/Agent');
const Client = require('../../database/models/Client');

const {AgentType} = require('./Agent');
const {ClientType} = require('./Client');

const AccountType = new GraphQLObjectType({
    name: 'AccountType',
    fields: () => ({
        id: { type: GraphQLID },
        account_number: { type: GraphQLString },
        client:  { 
            type: ClientType,
            resolve(parent, _args) {
                return Client.findById(parent.client);
            }
        },
        location: { type: GraphQLString },
        agent: { 
            type: AgentType,
            resolve(parent, _args) {
                return Agent.findById(parent.agent);
            },
        },
    }),
});


module.exports = AccountType;