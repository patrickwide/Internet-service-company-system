const Account = require("../../database/models/Account");

const AccountType = require("../types/Account")

const {
    GraphQLID, 
    GraphQLList,
} = require('graphql');

const AccountQuery = {
    accounts: {
        type: new GraphQLList(AccountType),
        resolve(_parent, _args) {
            return Account.find();
        }
    },
    account: {
        type: AccountType,
        args : {
            id: { type: GraphQLID }
        },
        resolve(_parent, args) {
            return Account.findById(args.id);
        },
    },
}

module.exports = AccountQuery;
