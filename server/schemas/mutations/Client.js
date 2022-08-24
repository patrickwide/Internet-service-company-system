const { 
    GraphQLNonNull, 
    GraphQLString, 
    GraphQLID 
} = require("graphql");

// import Client model
const Client = require("../../database/models/Client");

// import client types
const { ClientType, ClientAuthPayloadType } = require("../types/Client");

// import JsonWebTokenError
const { sign } = require('jsonwebtoken');

// import bcrypt
const { hash, compare } = require("bcrypt");

// import dotenv
require('dotenv').config();

// import user authentication
const authenticateUser = require("../auth")

// import Admin model
const Admin = require("../../database/models/Admin");

// import Agent model
const Agent = require("../../database/models/Agent");

const ClientMutation = {
    // signUpClient client
    signUpClient: {
        type: ClientAuthPayloadType,
        args: {
            name:{ type: new GraphQLNonNull(GraphQLString) },
            email: { type: new GraphQLNonNull(GraphQLString) },
            phone: { type: new GraphQLNonNull(GraphQLString) },
            password: { type: new GraphQLNonNull(GraphQLString) },
        },
        async resolve(_parent, args, _context) {

            // Hash the password
            const hashed_password = await hash(args.password, 10);

            // Create a new client and save
            const client = await new Client({
                name: args.name,
                email: args.email,
                phone: args.phone,
                password: hashed_password,
            }).save();

            // Add the a token to the response
            client.token = sign({clientId: client._id}, process.env.APP_SECRET);
            return client;
        },
    },
    // signIn client
    signInClient: {
        type: ClientAuthPayloadType,
        args: { 
            email: { type: new GraphQLNonNull(GraphQLString) },
            password: { type: new GraphQLNonNull(GraphQLString) },
        },
        async resolve(_parent, args, _context) {

            // Check if client exxist using the email
            let client = await Client.exists({ email: args.email });
            if (!client) {
                throw new Error("No such client found");
            }           

            // Get the client
            client = await Client.findById(client._id);

            // compare passwords
            const valid = await compare(args.password, client.password);
            if (!valid) {
              throw new Error("Invalid cridentials");
            }

            // Add the a token to the client object
            client.token = sign({clientId: client.id}, process.env.APP_SECRET);
            return client;
        }
    },
    // delete client
    deleteClient: {
        type: ClientType,
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

            // find and delete client
            return await Client.findByIdAndRemove(args.id);
        }
    },
    // update client
    updateClient: {
        type: ClientType,
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
            const allowedUsers = [ Client,Admin ];

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

                // Get the client
                const client = await Client.findById(args.id);
                if (!client) {
                    throw new Error("Unknown client.");
                }

                // compare passwords
                const valid = await compare(args.current_password, client.password);
                if (!valid) {
                    throw new Error("Invalid cridentials.");
                }

                // Hash the password
                hashed_password = await hash(args.new_password, 10);

            }

            // find and update client
            return await Client.findByIdAndUpdate(
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

}

module.exports = ClientMutation;