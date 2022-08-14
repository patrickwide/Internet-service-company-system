const { 
    GraphQLNonNull, 
    GraphQLString, 
    GraphQLID 
} = require("graphql");

const Technician = require("../../database/models/Technician");
const { TechnicianType } = require("../types/Technician");

const TechnicianMutation = {
    // add technician
    addTechnician: {
        type: TechnicianType,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
            email: { type: new GraphQLNonNull(GraphQLString) },
            phone: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve(_parent, args) {
            const technician = new Technician({
                name: args.name,
                email: args.email,
                phone: args.phone,
            });
            return technician.save();
        }
    },
    // delete technician
    deleteTechnician: {
        type: TechnicianType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve(_parent, args) {
            return Technician.findByIdAndRemove(args.id);
        },
    },
    // update technician
    updateTechnician: {
        type: TechnicianType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            name: { type: GraphQLString },
            email: { type: GraphQLString },
            phone: { type: GraphQLString },
        },
        resolve(_parent, args) {
            return Technician.findByIdAndUpdate(
                args.id,
                {
                    $set: {
                        name: args.name,
                        email: args.email,
                        phone: args.phone,
                    },
                },
                { new: true },
            );
        }
    }
};

module.exports = TechnicianMutation;