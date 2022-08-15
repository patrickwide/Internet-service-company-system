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
    // add client
    addClient: {
        type: ClientType,
        args: {
            name:{ type: new GraphQLNonNull(GraphQLString) },
            email: { type: new GraphQLNonNull(GraphQLString) },
            phone: { type: new GraphQLNonNull(GraphQLString) },
            password: { type: new GraphQLNonNull(GraphQLString) },
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
            // do something with the authenticated user (add history)
            console.log(authenticatedUser);
            const password = await hash(args.password, 10);

            const client = await new Client({
                name: args.name,
                email: args.email,
                phone: args.phone,
                password: password,
            }).save();

            client.token = sign({clientId: client._id}, process.env.APP_SECRET);
            return client;
        },
    },
    // login client
    loginClient: {
        type: ClientAuthPayloadType,
        args: { 
            email: { type: new GraphQLNonNull(GraphQLString) },
            password: { type: new GraphQLNonNull(GraphQLString) },
        },
        async resolve(_parent, args, context) {


            // A list of models(users) that are allowed for this request
            const allowedUsers = [ Admin, Client ];

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
            // do something with the authenticated user (add history)
            console.log(authenticatedUser.authenticatedUser);


            let client = await Client.exists({ email: args.email });
            if (!client) {
                throw new Error("No such client found");
            }           

            client = await Client.findById(client._id);

            const valid = await compare(args.password, client.password);
            if (!valid) {
              throw new Error("Invalid cridentials");
            }

            const token = sign({clientId: client.id}, process.env.APP_SECRET);
            client.token = token;
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
            
            return Client.findByIdAndRemove(args.id);
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
            
            return Client.findByIdAndUpdate(
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

}

module.exports = ClientMutation;