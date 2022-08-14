const Technician = require("../../database/models/Technician");

const { TechnicianType } = require("../types/Technician")

const {
    GraphQLID, 
    GraphQLList,
} = require('graphql');

const TechnicianQuery = {
    technicians: {
        type: new GraphQLList(TechnicianType),
        resolve(_parent, _args) {
            return Technician.find();
        }
    },
    technician: {
        type: TechnicianType,
        args: {
            id: { type: GraphQLID },
        },
        resolve(_parent, args) {
            return Technician.findById(args.id);
        },
    }
};

module.exports = TechnicianQuery;