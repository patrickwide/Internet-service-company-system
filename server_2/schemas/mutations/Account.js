const { 
    GraphQLNonNull, 
    GraphQLString, 
    GraphQLID 
} = require("graphql");
// import Account model
const Account = require("../../database/models/Account");
// import Account type
const AccountType = require("../types/Account");
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
            account_no: { type: new GraphQLNonNull(GraphQLString) },
            client_id: { type: new GraphQLNonNull(GraphQLString) },
            location: { type: new GraphQLNonNull(GraphQLString) },
            agent_id: { type: new GraphQLNonNull(GraphQLString) },
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

            const account = new Account({
                account_no: args.account_no,
                client_id: args.client_id,
                location: args.location,
                agent_id: args.agent_id,
            });
            
            let client_exists = Client.exists({ _id: args.client_id });
            let agent_exists = Agent.exists({ _id: args.client_id });

            if (!client_exists ) {
                return new Error("Error: The client provided doesn't exist.");
            } else if (!agent_exists) {
                return new Error("Error: The Agent provide doesn't exist."); 
            } else {
                return account.save();
            }
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
            
            return Account.findByIdAndDelete(args.id);
        }
    },
    // update account
    updateAccount: {
        type: AccountType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            account_no: { type: GraphQLString },
            client_id: { type: GraphQLString },
            location: { type: GraphQLString },
            agent_id: { type: GraphQLString },
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
            return Account.findByIdAndUpdate(
                args.id,
                {
                    $set: {
                        account_no: args.account_no,
                        client_id: args.client_id,
                        location: args.location,
                        agent_id: args.agent_id,        
                    },
                },
                { new: true },
            );
        },
    }
}

module.exports = AccountMutation;