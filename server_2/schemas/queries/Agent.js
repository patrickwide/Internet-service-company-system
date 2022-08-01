const Agent = require("../../database/models/Agent");

const AgentType = require("../types/Agent")


const {
    GraphQLID, 
    GraphQLList,
} = require('graphql');

const AgentQuery = {
    agents: {
        type: new GraphQLList(AgentType),
        resolve(_parent, _args) {
            return Agent.find();
        }
    },
    agent: {
        type: AgentType,
        args: {
            id: {
                type: GraphQLID
            }
        },
        resolve(_parent, args) {
            return Agent.findById(args.id)
        } 
    }
}

module.exports = {
    AgentQuery
};