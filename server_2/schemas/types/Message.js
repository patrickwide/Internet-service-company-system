const {
    GraphQLObjectType, 
    GraphQLID, 
    GraphQLString, 
} = require('graphql');


const AdminType = require('./Admin');
const AgentType = require('./Agent');
const ClientType = require('./Client');
const TechnicianType = require('./Technician');
const IssueType = require('./Issue');

const Client = require('../../database-helpers/models/Client')
const Agent = require('../../database-helpers/models/Agent')
const Technician = require('../../database-helpers/models/Technician')
const Admin = require('../../database-helpers/models/Admin');
const Issue = require('../../database-helpers/models/Issue');

// * This Union object we use in our IssueType sender's field so when querying 
// we can have a user if the object sender is a Client instance, Agent instance...  Admin instance
const SenderIdUnion = new GraphQLUnionType({
    name: 'SenderIdUnion',
    types: [ClientType, AgentType,TechnicianType, AdminType ],
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

const MessageType = new GraphQLObjectType({
    name: 'Message',
    fields: () => ({
        id: { type: GraphQLID },
        sender: { type: SenderIdUnion },
        issue: {
            type: IssueType,
            resolve(parent, _args) {
                return Issue.findById(parent.issue_id);
            }
        },
        message_body: { type: GraphQLString },
    }),
})