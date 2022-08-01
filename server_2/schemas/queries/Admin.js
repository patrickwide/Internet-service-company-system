const Admin = require("../../database/models/Admin");

const AdminType = require("../types/Admin")

const {
    GraphQLID, 
    GraphQLList,
} = require('graphql');

const AdminQuery = {
    admins: {
        type: new GraphQLList(AdminType),
        resolve(_parent, _args) {
            return Admin.find();
        }
    },
    admin: {
        type: AdminType,
        args: {
            id: {
                type: GraphQLID
            }
        },
        resolve(_parent, args) {
            return Admin.findById(args.id)
        } 
    }
};

module.exports = {
    AdminQuery,
};

