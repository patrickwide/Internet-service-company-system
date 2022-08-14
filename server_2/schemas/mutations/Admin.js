const { 
    GraphQLNonNull, 
    GraphQLString, 
    GraphQLID 
} = require("graphql");

const Admin = require("../../database/models/Admin");
const { AdminType } = require("../types/Admin");

const AdminMutation = {
    // add admin
    addAdmin: {
        type: AdminType,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
            email: { type: new GraphQLNonNull(GraphQLString) },
            phone: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve(_parent, args) {
            const admin = new Admin({
                name: args.name,
                email: args.email,
                phone: args.phone,
            });
            return admin.save()
        }
    },
    // delete admin
    deleteAdmin: {
        type: AdminType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve(_parent, args) {
            return Admin.findByIdAndRemove(args.id);
        }
    },
    // Update admin
    updateAdmin: {
        type: AdminType, 
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            name: { type: GraphQLString },
            email: { type: GraphQLString },
            phone: { type: GraphQLString },
        },
        resolve(_parent, args) {
            return Admin.findByIdAndUpdate(
                args.id,
                {
                    $set: {
                        name: args.name,
                        email: args.email,
                        phone: args.phone,
                    }
                },
                { new: true },
            );
        }
    }
}

module.exports = AdminMutation;