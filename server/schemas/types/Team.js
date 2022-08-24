const {
    GraphQLObjectType, 
    GraphQLID, 
    GraphQLString, 
    GraphQLList
} = require('graphql');

// import models
const Team = require("../../database/models/Team");
const Technician = require("../../database/models/Technician");
const Ticket = require("../../database/models/Ticket");

// import Types
const { TechnicianType } = require("./Technician");
const TicketType = require("./Ticket");

const TeamType = new GraphQLObjectType({
    name:'TeamType',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        category: { type: GraphQLString },
        technicians: { 
            type: new GraphQLList(TechnicianType),
            async resolve(parent, _args) {
                 return await Technician.find({"_id": parent.technicians })
            }
        },
        slot: { 
            type: TicketType,
            resolve(parent, _args) {
                return Ticket.findById(parent.slot)
            }
        },
    }),
});

module.exports = TeamType;

// how to populate a list GraphQLObjectType using it's id 