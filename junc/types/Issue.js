const {
    GraphQLObjectType, 
    GraphQLID, 
    GraphQLString, 
    GraphQLUnionType
} = require('graphql');

const AdminType = require('./Admin');
const AgentType = require('./Agent');
const ClientType = require('./Client');
const TechnicianType = require('./Technician');

const Client = require('../../database-helpers/models/Client')
const Agent = require('../../database-helpers/models/Agent')
const Technician = require('../../database-helpers/models/Technician')
const Admin = require('../../database-helpers/models/Admin')

// * This Union object we use in our IssueType sender's field so when querying 
// we can have a user if the object sender is a Client instance, Agent instance...  Admin instance
const SenderIdUnion = new GraphQLUnionType({
    name: 'IssueSenderUnion',
    types: [ ClientType ,AgentType ,TechnicianType , AdminType ],
    resolveType(value) {
        if (value instanceof Client ) {
            //* if the sender_id field from the IssueType is a client instance, return ClientType
            return ClientType;
        }
        else if (value instanceof Agent ) {
            //* if the sender_id field from the IssueType is a Agent instance, return AgentType
            return AgentType;
        }
        else if (value instanceof Technician ) {
            //* if the sender_id field from the IssueType is a Technician instance, return TechnicianType
            return TechnicianType;
        }
        else if (value instanceof Admin ) {
            //* if the sender_id field from the IssueType is a Admin instance, return AdminType
            return AdminType;
        } 
    }
});

const IssueType = new GraphQLObjectType({
    name: 'Issue',
    fields: () => ({
        id: { type: GraphQLID },
        sender: { type: SenderIdUnion },
        status: { type: GraphQLString },
        issue_body: { type: GraphQLString },    
    }),
});

module.exports = IssueType;