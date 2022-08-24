const {
    GraphQLUnionType,
} = require("graphql");

const ClientModel = require('../../../database/models/Client');
const { ClientType } = require('../Client');

const AgentModel = require('../../../database/models/Agent');
const { AgentType } = require('../Agent');

const AdminModel = require('../../../database/models/Admin');
const { AdminType } = require('../Admin');

const TechnicianModel = require('../../../database/models/Technician');
const { TechnicianType } = require('../Technician');

const SenderUnion = new GraphQLUnionType({
    name: 'SenderUnion',
    types: [ ClientType, AgentType, AdminType, TechnicianType ],
    resolveType(value) {
        if (value instanceof ClientModel) {
            return 'ClientType';
        } else if (value instanceof AgentModel) {
            return 'AgentType';
        } else if (value instanceof AdminModel) {
            return 'AdminType';
        } else if (value instanceof TechnicianModel) {
            return 'TechnicianType';d
        }
    },
});

module.exports = SenderUnion;