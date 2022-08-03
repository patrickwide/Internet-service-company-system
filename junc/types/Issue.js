const { GraphQLObjectType, GraphQLID, GraphQLUnionType, GraphQLString } = require("graphql");

// types
const ClientType = require("../../server_2/schemas/types/Client");
const AgentType = require("../../server_2/schemas/types/Agent");
const TechnicianType = require("../../server_2/schemas/types/Technician");
const AdminType = require("../../server_2/schemas/types/Admin");

// models
const ClientModel = require("../../server_2/database/models/Client");
const AgentModel = require("../../server_2/database/models/Agent");
const TechnicianModel = require("../../server_2/database/models/Technician");
const AdminModel = require("../../server_2/database/models/Admin");

const IssueSenderUnion = new GraphQLUnionType({
    name: 'IssueSenderUnion',
    types: [ ClientType, AgentType, TechnicianType, AdminType ],
    resolveType(value) {
        console.log(value);
        if (value instanceof ClientModel) {
            return ClientType;
        } else if (value instanceof AgentModel) {
            return AgentType;
        } else if (value instanceof TechnicianModel) {
            return TechnicianType;
        } else if (value instanceof AdminModel) {
            return AdminType;
        } 
    }
});

const IssueType = new GraphQLObjectType({
    name: 'IssueType',
    fields: () => ({
        id: { type: GraphQLID },
        sender: {
            type: ClientType,
            resolve(parent, _args) {
                return ClientModel.findById(parent.sender);
            }
        },
        status: { type: GraphQLString },
        issue_body: { type: GraphQLString },
    })
});

module.exports = IssueType;