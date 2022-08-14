const { 
    GraphQLNonNull, 
    GraphQLString, 
    GraphQLID 
} = require("graphql");
// import admin model
const Admin = require("../../database/models/Admin");
// import Admin type
const { AdminType, AdminAuthPayloadType } = require("../types/Admin");
// import user authentication
const authenticateUser = require("../auth");

const AdminMutation = {
    // add admin
    addAdmin: {
        type: AdminType,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
            email: { type: new GraphQLNonNull(GraphQLString) },
            phone: { type: new GraphQLNonNull(GraphQLString) },
        },
        async resolve(_parent, args, context) {

            // A list of models(users) that are allowed for this request
            const allowedUsers = [ Admin ];

            // authenticate the user
            const authentiactedUser = await authenticateUser(allowedUsers, context);

            // if user is authenticated
            if (authentiactedUser === 1) {
                throw new Error("User is not authentiacted.");
            }

            // if authenticated user is allowed for this request
            if (authentiactedUser === 2 ) {
                throw new Error("User is not authorized for this request.");
            } 

            const admin = new Admin({
                name: args.name,
                email: args.email,
                phone: args.phone,
            });
            return admin.save()
        }
    },
    // login admin
    loginAdmin: {
        type: AdminAuthPayloadType,
        args: { 
            email: { type: new GraphQLNonNull(GraphQLString) },
            password: { type: new GraphQLNonNull(GraphQLString) },
        },
        async resolve(_parent, args, _context) {

            let admin = await Admin.exists({ email: args.email });
            if (!admin) {
                throw new Error("No such admin found");
            }           

            admin = await Admin.findById(admin._id);

            const valid = await compare(args.password, admin.password);
            if (!valid) {
              throw new Error("Invalid cridentials");
            }

            const token = sign({adminId: admin.id}, process.env.APP_SECRET);
            admin.token = token;
            return admin;
        }
    },
    // delete admin
    deleteAdmin: {
        type: AdminType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        async resolve(_parent, args, context) {
            // A list of models(users) that are allowed for this request
            const allowedUsers = [ Admin ];

            // authenticate the user
            const authentiactedUser = await authenticateUser(allowedUsers, context);

            // if user is authenticated
            if (authentiactedUser === 1) {
                throw new Error("User is not authentiacted.");
            }

            // if authenticated user is allowed for this request
            if (authentiactedUser === 2 ) {
                throw new Error("User is not authorized for this request.");
            } 

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
        async resolve(_parent, args, context) {

            // A list of models(users) that are allowed for this request
            const allowedUsers = [ Admin ];

            // authenticate the user
            const authentiactedUser = await authenticateUser(allowedUsers, context);

            // if user is authenticated
            if (authentiactedUser === 1) {
                throw new Error("User is not authentiacted.");
            }

            // if authenticated user is allowed for this request
            if (authentiactedUser === 2 ) {
                throw new Error("User is not authorized for this request.");
            } 
            
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