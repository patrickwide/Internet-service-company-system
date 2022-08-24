const { 
    GraphQLNonNull, 
    GraphQLString, 
    GraphQLID 
} = require("graphql");

// import Account model
const Account = require("../../database/models/Account");

// import Account type
const AccountType = require("../types/Account");

// import Admin model
const Admin = require("../../database/models/Admin");

// import Agent model
const Agent = require("../../database/models/Agent");

// import Client model
const Client = require("../../database/models/Client");

// import user authentication
const authenticateUser = require("../auth");

const AccountMutation = {
    // add account
    addAccount: {
        type: AccountType,
        args: {
            account_number: { type: new GraphQLNonNull(GraphQLString) },
            client: { type: new GraphQLNonNull(GraphQLString) },
            location: { type: new GraphQLNonNull(GraphQLString) },
            agent: { type: new GraphQLNonNull(GraphQLString) },
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

            
            // check if the client provided is valid
            let client_exists = Client.exists({ _id: args.client });
            if (!client_exists ) {
                return new Error("Error: The client provided doesn't exist.");
            } 
            
            // check if the agent provided is valid
            let agent_exists = Agent.exists({ _id: args.client });
            if (!agent_exists) {
                return new Error("Error: The Agent provide doesn't exist."); 
            }            
            
            const account = new Account({
                account_number: args.account_number,
                client: args.client,
                location: args.location,
                agent: args.agent,
            });

            return await account.save();
        },
    },
    // delete account
    deleteAccount: {
        type: AccountType,
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
            
            return await Account.findByIdAndDelete(args.id);
        }
    },
    // update account
    updateAccount: {
        type: AccountType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            account_number: { type: GraphQLString },
            client: { type: GraphQLString },
            location: { type: GraphQLString },
            agent: { type: GraphQLString },
        },
        async resolve(_parent, args, context) {

            // A list of models(users) that are allowed for this request
            const allowedUsers = [ Admin, Agent, Client ];

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

            // more authorization checks here
            return await Account.findByIdAndUpdate(
                args.id,
                {
                    $set: {
                        account_number: args.account_number,
                        client: args.client,
                        location: args.location,
                        agent: args.agent,        
                    },
                },
                { new: true },
            );
        },
    }
}

module.exports = AccountMutation;