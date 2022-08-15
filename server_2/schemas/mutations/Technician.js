const { 
    GraphQLNonNull, 
    GraphQLString, 
    GraphQLID 
} = require("graphql");

// import Technician model
const Technician = require("../../database/models/Technician");
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

            const technician = new Technician({
                name: args.name,
                email: args.email,
                phone: args.phone,
            });

            return technician.save();
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