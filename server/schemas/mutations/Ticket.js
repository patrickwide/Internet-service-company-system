const { 
    GraphQLNonNull, 
    GraphQLString, 
    GraphQLID, 
    GraphQLEnumType
} = require("graphql");

// import Ticket model
const Ticket = require("../../database/models/Ticket");

// import Ticket type
const TicketType = require("../types/Ticket");

// import models
const Client = require("../../database/models/Client");
const Agent = require("../../database/models/Agent");
const Admin = require("../../database/models/Admin");
const Technician = require("../../database/models/Technician");

// import auth
const authenticateUser = require("../auth/");

const TicketMutation = {
    // add ticket
    addTicket: {
        type: TicketType,
        args: {
            account : { type: new GraphQLNonNull(GraphQLString) },
            category : { 
                type: new GraphQLEnumType({
                    name: 'AddTicketCategory',
                    values: {
                        install: { value: 'Installation' },
                        shift: { value: 'Shiffting' },
                        error: { value: 'Error' },
                    }
                }),
            },
            client_available_date: { type: new GraphQLNonNull(GraphQLString) },
            client_available_time: { type: new GraphQLNonNull(GraphQLString) },
            note: { type: GraphQLString },
        },
        async resolve(_parent, args, context) {
            // A list of models(users) that are allowed for this request
            const allowedUsers = [ Agent,Client ];
            
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

            // Check if client is related to account

            const ticket = await new Ticket({
                account: args.account,
                category: args.category,
                client_available_date: args.client_available_date,
                client_available_time: args.client_available_time,
                note: args.note,
            }).save();
            
            return ticket; 
        }
    },
    // delete ticket
    deleteTicket: {
        type: TicketType,
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

            return Ticket.findByIdAndDelete(args.id);
        }
    },
    // update ticket
    updateTicket: {
        type: TicketType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            account : { type: GraphQLString },
            category: { 
                type: new GraphQLEnumType({
                    name: 'UpdateTicketCategory',
                    values: {
                        install: { value: 'Installation' },
                        shift: { value: 'Shiffting' },
                        error: { value: 'Error' },
                    }
                }),
            },
            client_available_data: { type: GraphQLString },
            client_available_time: { type: GraphQLString },
            status: {
                type: new GraphQLEnumType({
                    name: 'UpdateTicketStatus',
                    values: {
                        queuing: { value: 'Queuing'} ,
                        canceled: { value: 'Canceled'} ,
                        pending: { value: 'Pending'} ,
                        done: { value: 'Done'} 
                    }
                })
            },
            note: { type: GraphQLString },
        },
        async resolve(_parent, args, context) {
            // A list of models(users) that are allowed for this request
            const allowedUsers = [ Admin,Agent,Technician ];
            
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

            return Ticket.findByIdAndUpdate(
                args.id,
                {
                    $set: {
                        category: args.category,
                        account: args.account,
                        client_available_data: args.client_available_data,
                        client_available_time: args.client_available_time,
                        status: args.status,
                        note: args.note,
                    }
                },
                { new: true },
            );
        },
    }
}

module.exports = TicketMutation;