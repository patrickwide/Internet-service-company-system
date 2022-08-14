const { 
    GraphQLNonNull, 
    GraphQLString, 
    GraphQLID 
} = require("graphql");
// import Agent
const Agent = require("../../database/models/Agent");
// import Agent type and payload type
const { AgentType, AgentAuthPayloadType } = require("../types/Agent");
// import admin model
const Admin = require("../../database/models/Admin");
// import user authentication
const authenticateUser = require("../auth");

const AgentMutation = {
    // add agent
    addAgent: {
        type: AgentType,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
            email: { type: new GraphQLNonNull(GraphQLString) },
            phone: { type: new GraphQLNonNull(GraphQLString) },
        },
        async resolve(_parent, args, context) {

            // A list of models(users) that are allowed for this request
            const allowedUsers = [ Admin ];

            // authenticate the user
            const authentiactedUser = await authenticateUser(allowedUsers, context);

            // if user is authenticated
            if (authentiactedUser === 1) {
                throw new Error("User is not authentiacted.");
            }

            // if authenticated user is allowed for this request
            if (authentiactedUser === 2 ) {
                throw new Error("User is not authorized for this request.");
            } 

            const agent = new Agent({
                name: args.name,
                email: args.email,
                phone: args.phone,
            });
            
            return agent.save();
        }
    },
    // login agent
    loginAgent: {
        type: AgentAuthPayloadType,
        args: { 
            email: { type: new GraphQLNonNull(GraphQLString) },
            password: { type: new GraphQLNonNull(GraphQLString) },
        },
        async resolve(_parent, args, _context) {

            let agent = await Agent.exists({ email: args.email });
            if (!agent) {
                throw new Error("No such agent found");
            }           

            agent = await Agent.findById(agent._id);

            const valid = await compare(args.password, agent.password);
            if (!valid) {
              throw new Error("Invalid cridentials");
            }

            const token = sign({agentId: agent.id}, process.env.APP_SECRET);
            agent.token = token;

            return agent;
        }
    },
    // delete agent
    deleteAgent: {
        type: AgentType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        async resolve(_parent, args, context) {

            // A list of models(users) that are allowed for this request
            const allowedUsers = [ Admin ];

            // authenticate the user
            const authentiactedUser = await authenticateUser(allowedUsers, context);

            // if user is authenticated
            if (authentiactedUser === 1) {
                throw new Error("User is not authentiacted.");
            }

            // if authenticated user is allowed for this request
            if (authentiactedUser === 2 ) {
                throw new Error("User is not authorized for this request.");
            } 

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
        async resolve(_parent, args, context) {

            // A list of models(users) that are allowed for this request
            const allowedUsers = [ Admin ];

            // authenticate the user
            const authentiactedUser = await authenticateUser(allowedUsers, context);

            // if user is authenticated
            if (authentiactedUser === 1) {
                throw new Error("User is not authentiacted.");
            }

            // if authenticated user is allowed for this request
            if (authentiactedUser === 2 ) {
                throw new Error("User is not authorized for this request.");
            } 

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