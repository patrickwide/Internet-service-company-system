const {
    GraphQLObjectType, 
    GraphQLID, 
    GraphQLString, 
} = require('graphql');

const AccountType = require("./Account");
const {TechnicianType} = require("./Technician");

const Account = require("../../database/models/Account");
const Technician = require("../../database/models/Technician");

const TicketType = new GraphQLObjectType({
    name:'TicketType',
    fields: () => ({
        id: { type: GraphQLID },
        account: {
            type: AccountType,
            resolve(parent, _args) {
                return Account.findById(parent.account_id);
            }
        },
        category: { type: GraphQLString },
        client_available_date: { type: GraphQLString },
        client_available_time: { type: GraphQLString },
        status: { type: GraphQLString },
        note: { type: GraphQLString },
        technician: {
            type: TechnicianType,
            resolve(parent, _args) {
                return Technician.findById(parent.technician_id);
            },
        },
    }),
});



module.exports = TicketType;