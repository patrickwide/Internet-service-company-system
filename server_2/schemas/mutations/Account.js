const { 
    GraphQLNonNull, 
    GraphQLString, 
    GraphQLID 
} = require("graphql");

const Account = require("../../database/models/Account");
const AccountType = require("../types/Account");
const Agent = require("../../database/models/Agent");
const Client = require("../../database/models/Client");

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
        async resolve(_parent, args) {

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
        resolve(_parent, args) {
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
        resolve(_parent, args) {
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