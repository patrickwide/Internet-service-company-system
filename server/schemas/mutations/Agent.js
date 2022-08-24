const { 
    GraphQLNonNull, 
    GraphQLString, 
    GraphQLID 
} = require("graphql");

// import Agent
const Agent = require("../../database/models/Agent");

// import JsonWebTokenError
const { sign } = require('jsonwebtoken');

// import bcrypt
const { hash, compare } = require("bcrypt");

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
            password: { type: new GraphQLNonNull(GraphQLString) },
        },
        async resolve(_parent, args, context) {

            // A list of models(users) that are allowed for this request
            const allowedUsers = [ Admin ];

            // authenticate the user
            const authenticatedUser = await authenticateUser(allowedUsers, context);

            // if user is authenticated
            if (authenticatedUser === 1) {
                throw new Error("User is not authentiacted.");
            }

            // if authenticated user is allowed for this request
            if (authenticatedUser === 2 ) {
                throw new Error("User is not authorized for this request.");
            } 

            // Hash the password
            const hashed_password = await hash(args.password, 10);

            const agent = new Agent({
                name: args.name,
                email: args.email,
                phone: args.phone,
                password: hashed_password,
            });
            
            return await agent.save();
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
            const authenticatedUser = await authenticateUser(allowedUsers, context);

            // if user is authenticated
            if (authenticatedUser === 1) {
                throw new Error("User is not authentiacted.");
            }

            // if authenticated user is allowed for this request
            if (authenticatedUser === 2 ) {
                throw new Error("User is not authorized for this request.");
            } 

            return await Agent.findByIdAndRemove(args.id);
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
            new_password: { type: GraphQLString },
            current_password: { type: GraphQLString },
        },
        async resolve(_parent, args, context) {

            // A list of models(users) that are allowed for this request
            const allowedUsers = [ Admin,Agent ];

            // authenticate the user
            const authenticatedUser = await authenticateUser(allowedUsers, context);

            // if user is authenticated
            if (authenticatedUser === 1) {
                throw new Error("User is not authentiacted.");
            }

            // if authenticated user is allowed for this request
            if (authenticatedUser === 2 ) {
                throw new Error("User is not authorized for this request.");
            } 

            let hashed_password;

            // Check if password look same
            if (args.new_password) {
                
                // Check the current passwword
                if (!args.current_password) {
                    throw new Error("You have to input your current password.");
                }
                
                // Check if the current_password and new_password are same
                if (args.new_password === args.current_password) {
                    throw new Error("Password cannot be same.");
                }

                // Get the agent
                const agent = await Agent.findById(args.id);
                if (!agent) {
                    throw new Error("Unknown agent.");
                }

                // compare passwords
                const valid = await compare(args.current_password, agent.password);
                if (!valid) {
                    throw new Error("Invalid cridentials.");
                }

                // Hash the password
                hashed_password = await hash(args.new_password, 10);

            }

            return await Agent.findByIdAndUpdate(
                args.id,
                {
                    $set: {
                        name: args.name,
                        email: args.email,
                        phone: args.phone,
                        password: hashed_password,                    
                    }
                },
                { new: true },
            );
        },
    },
};

module.exports = AgentMutation;