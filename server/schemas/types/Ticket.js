const {
    GraphQLObjectType, 
    GraphQLID, 
    GraphQLString, 
} = require('graphql');

// import type
const AccountType = require("./Account");

// import model
const AccountModel = require("../../database/models/Account");

const TicketType = new GraphQLObjectType({
    name:'TicketType',
    fields: () => ({
        id: { 
            type: GraphQLID 
        },
        account: {
            type: AccountType,
            resolve(parent, _args) {
                return AccountModel.findById(parent.account);
            }
        },
        category: { 
            type: GraphQLString 
        },
        client_available_date: { 
            type: GraphQLString 
        },
        client_available_time: { 
            type: GraphQLString 
        },
        status: { 
            type: GraphQLString 
        },
        note: { 
            type: GraphQLString 
        },
    }),
});



module.exports = TicketType;