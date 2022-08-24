const { 
    GraphQLNonNull, 
    GraphQLString, 
    GraphQLID 
} = require("graphql");

// import admin model
const Admin = require("../../database/models/Admin");

// import Admin type
const { AdminType, AdminAuthPayloadType } = require("../types/Admin");

// import JsonWebTokenError
const { sign } = require('jsonwebtoken');

// import bcrypt
const { hash, compare } = require("bcrypt");

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
            password: { type: new GraphQLNonNull(GraphQLString) },
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

            // Hash the password
            const hashed_password = await hash(args.password, 10);

            // create and save new Admin
            const admin = await new Admin({
                name: args.name,
                email: args.email,
                phone: args.phone,
                password: hashed_password,
            }).save();

            return admin;
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
            const authenticatedUser = await authenticateUser(allowedUsers, context);

            // if user is authenticated
            if (authenticatedUser === 1) {
                throw new Error("User is not authentiacted.");
            }

            // if authenticated user is allowed for this request
            if (authenticatedUser === 2 ) {
                throw new Error("User is not authorized for this request.");
            } 

            return await Admin.findByIdAndRemove(args.id);
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
            new_password: { type: GraphQLString },
            current_password: { type: GraphQLString },
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

            let hashed_password;
            
            // Check if password look same
            if (args.new_password) {
                // Check the current passwword
                if (!args.current_password) {
                    throw new Error("You have to input your current password.");
                }
                
                // Check if the current_password and new_password are same
                if (args.new_password === args.current_password) {
                    throw new Error("Password cannot be same.");
                }

                // Get the admin
                const admin = await Admin.findById(args.id);
                if (!admin) {
                    throw new Error("Unknown admin.");
                }

                // compare passwords
                const valid = await compare(args.current_password, admin.password);
                if (!valid) {
                    throw new Error("Invalid cridentials.");
                }

                // Hash the password
                hashed_password = await hash(args.new_password, 10);
            }

            return await Admin.findByIdAndUpdate(
                args.id,
                {
                    $set: {
                        name: args.name,
                        email: args.email,
                        phone: args.phone,
                        password: hashed_password,                    
                    }
                },
                { new: true },
            );
        }
    }
}

module.exports = AdminMutation;