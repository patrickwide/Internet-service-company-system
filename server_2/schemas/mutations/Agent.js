const { 
    GraphQLNonNull, 
    GraphQLString, 
    GraphQLID 
} = require("graphql");

const Agent = require("../../database/models/Agent");
const { AgentType } = require("../types/Agent");

const AgentMutation = {
    // add agent
    addAgent: {
        type: AgentType,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
            email: { type: new GraphQLNonNull(GraphQLString) },
            phone: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve(_parent, args) {
            const agent = new Agent({
                name: args.name,
                email: args.email,
                phone: args.phone,
            });
            return agent.save();
        }
    },
    // delete agent
    deleteAgent: {
        type: AgentType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve(_parent, args) {
            return Agent.findByIdAndRemove(args.id);
        },
    },
    // update agent
    updateAgent: {
        type: AgentType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            name: { type: GraphQLString },
            email: { type: GraphQLString },
            phone: { type: GraphQLString },
        },
        resolve(_parent, args) {
            return Agent.findByIdAndUpdate(
                args.id,
                {
                    $set: {
                        name: args.name,
                        email: args.email,
                        phone: args.phone,
                    }
                },
                { new: true },
            );
        },
    },
};

module.exports = AgentMutation;