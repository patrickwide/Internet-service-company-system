const { 
    GraphQLNonNull, 
    GraphQLString, 
    GraphQLID 
} = require("graphql");

const Client = require("../../database/models/Client");
const { ClientType, ClientAuthPayloadType } = require("../types/Client");
// import JsonWebTokenError
const { sign } = require('jsonwebtoken');

// import bcrypt
const { hash, compare } = require("bcrypt");

// import dotenv
require('dotenv').config();


const authenticateClient = require("../auth")
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
        async resolve(_parent, args) {
            
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
    // loging
    loginClient: {
        type: ClientAuthPayloadType,
        args: { 
            email: { type: new GraphQLNonNull(GraphQLString) },
            password: { type: new GraphQLNonNull(GraphQLString) },
        },
        async resolve(_parent, args, context) {
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
        resolve(_parent, args) {
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
        async resolve(_parent, args) {

            // const authentiactedClient = await authenticateClient(Client, context);
            // if (authentiactedClient === null ) {
            //     throw new Error("User is not authentiacted");
            // }

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