const Ticket = require("../../database/models/Ticket");
const TicketType = require("../types/Ticket");

const {
    GraphQLID, 
    GraphQLList,
} = require('graphql');

const TicketQuery = {
    tickets: {
        type: new GraphQLList(TicketType),
        resolve(_parent, _args) {
            return Ticket.find();
        }
    },
    ticket: {
        type: TicketType,
        args: { 
            id: { type: GraphQLID },
        },
        resolve(_parent, args) {
            return Ticket.findById(args.id);
        },
    },
};

module.exports = TicketQuery;