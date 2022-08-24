const { 
    GraphQLNonNull, 
    GraphQLString, 
    GraphQLID 
} = require("graphql");

// import Technician model
const Technician = require("../../database/models/Technician");

// import JsonWebTokenError
const { sign } = require('jsonwebtoken');

// import bcrypt
const { hash, compare } = require("bcrypt");

// import Technician type and Payload Type 
const { TechnicianType, TechnicianAuthPayloadType } = require("../types/Technician");

// import admin model
const Admin = require("../../database/models/Admin");

// import user authentication
const authenticateUser = require("../auth");

const TechnicianMutation = {
    // add technician
    addTechnician: {
        type: TechnicianType,
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

            const technician = new Technician({
                name: args.name,
                email: args.email,
                phone: args.phone,
                password: hashed_password,
            });

            return await technician.save();
        }
    },
    // login technician
    loginTechnician: {
        type: TechnicianAuthPayloadType,
        args: { 
            email: { type: new GraphQLNonNull(GraphQLString) },
            password: { type: new GraphQLNonNull(GraphQLString) },
        },
        async resolve(_parent, args, _context) {

            let technician = await Technician.exists({ email: args.email });
            if (!technician) {
                throw new Error("No such technician found");
            }           

            technician = await Technician.findById(technician._id);

            const valid = await compare(args.password, technician.password);
            if (!valid) {
              throw new Error("Invalid cridentials");
            }

            const token = sign({technicianId: technician.id}, process.env.APP_SECRET);
            technician.token = token;

            return technician;
        }
    },
    // delete technician
    deleteTechnician: {
        type: TechnicianType,
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

            return await Technician.findByIdAndRemove(args.id);
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
            new_password: { type: GraphQLString },
            current_password: { type: new GraphQLNonNull(GraphQLString) },
        },
        async resolve(_parent, args, context) {

            // A list of models(users) that are allowed for this request
            const allowedUsers = [ Admin,Technician ];

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

                // Get the technician
                const technician = await Technician.findById(args.id);
                if (!technician) {
                    throw new Error("Unknown technician.");
                }

                // compare passwords
                const valid = await compare(args.current_password, technician.password);
                if (!valid) {
                    throw new Error("Invalid cridentials.");
                }

                // Hash the password
                hashed_password = await hash(args.new_password, 10);

            }

            return await Technician.findByIdAndUpdate(
                args.id,
                {
                    $set: {
                        name: args.name,
                        email: args.email,
                        phone: args.phone,
                        password: hashed_password,
                    },
                },
                { new: true },
            );
        }
    }
};

module.exports = TechnicianMutation;