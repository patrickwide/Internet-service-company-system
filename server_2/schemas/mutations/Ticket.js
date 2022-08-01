const { 
    GraphQLNonNull, 
    GraphQLString, 
    GraphQLID, 
    GraphQLEnumType
} = require("graphql");

const Ticket = require("../../database/models/Ticket");

const TicketType = require("../types/Ticket");

const TicketMutation = {
    // add ticket
    addTicket: {
        type: TicketType,
        args: {
            account_id : { type: new GraphQLNonNull(GraphQLString) },
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
            status: {
                type: new GraphQLEnumType({
                    name: 'AddTicketStatus',
                    values: {
                        queuing: { value: 'Queuing'} ,
                        canceled: { value: 'Canceled'} ,
                        pending: { value: 'Pending'} ,
                        done: { value: 'Done'} 
                    }
                })
            },
            note: { type: GraphQLString },
            technician_id: { type: GraphQLString },
        },
        resolve(_parent, args) {
            const ticket = new Ticket({
                account_id: args.account_id,
                category: args.category,
                client_available_date: args.client_available_date,
                client_available_time: args.client_available_time,
                // status: args.status,
                note: args.note,
            });
            return ticket.save(); 
        }
    },
    // delete ticket
    deleteTicket: {
        type: TicketType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve(_parent, args) {
            return Ticket.findByIdAndDelete(args.id);
        }
    },
    // update ticket
    updateTicket: {
        type: TicketType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
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
            technician_id: { type: GraphQLString },
        },
        resolve(_parent, args) {
            return Ticket.findByIdAndUpdate(
                args.id,
                {
                    $set: {
                        category: args.category,
                        client_available_data: args.client_available_data,
                        client_available_time: args.client_available_time,
                        status: args.status,
                        note: args.note,
                        technician_id: args.technician_id,            
                    }
                },
                { new: false },
            );
        },
    }
}

module.exports = TicketMutation;