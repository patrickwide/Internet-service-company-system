const { GraphQLObjectType, GraphQLID, GraphQLUnionType, GraphQLString } = require("graphql");

// types
const ClientType = require("./Client");
const AgentType = require("./Agent");
const TechnicianType = require("./Technician");
const AdminType = require("./Admin");

// models
const Client = require("../../database/models/Client");
const Agent = require("../../database/models/Agent");
const Technician = require("../../database/models/Technician");
const Admin = require("../../database/models/Admin");

const IssueSenderUnion = new GraphQLUnionType({
    name: 'IssueSenderUnion',
    types: [ ClientType, AgentType, TechnicianType, AdminType ],
    resolveType(value) {
        if (value instanceof Client) {
            return ClientType;
        } else if (value instanceof Agent) {
            return AgentType;
        } else if (value instanceof Technician) {
            return TechnicianType;
        } else if (value instanceof Admin) {
            return AdminType;
        }
    }
});

const IssueType = new GraphQLObjectType({
    name: 'IssueType',
    fields: () => ({
        id: { type: GraphQLID },
        sender: { type: IssueSenderUnion },
        sender_model: { type: GraphQLString },
        status: { type: GraphQLString },
        issue_body: { type: GraphQLString },
    })
});

module.exports = IssueType;