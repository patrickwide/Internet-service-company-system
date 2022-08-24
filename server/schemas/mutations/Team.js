const { 
    GraphQLNonNull, 
    GraphQLString, 
    GraphQLID, 
    GraphQLEnumType,
    GraphQLList
} = require("graphql");

// import Team types
const TeamType = require("../types/Team");

// import Team model
const Team = require("../../database/models/Team");
const Admin = require("../../database/models/Admin");

// import auth
const authenticateUser = require("../auth/");

const TeamMutation = {
    // add team
    addTeam: {
        type: TeamType,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
            category: {
                type: new GraphQLEnumType({
                    name:"AddTeamCategory",
                    values: {
                        install: { value: 'Installation' },
                        shift: { value: 'Shiffting' },
                        error: { value: 'Error' },
                    }
                }),
            },
            technicians: { type: new GraphQLList(GraphQLString) },
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

            const team = new Team({
                name: args.name,
                category: args.category,
                technicians: args.technicians,
            });

            return await team.save();
        }
    },
    // delete team
    deleteTeam: {
        type: TeamType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLString) },
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

            return await Team.findByIdAndRemove(args.id);
        }
    },
    // update team
    updateTeam: {
        type: TeamType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLString) },
            name: { type: GraphQLString },
            category: {
                type: new GraphQLEnumType({
                    name:"UpdateTeamCategory",
                    values: {
                        install: { value: 'Installation' },
                        shift: { value: 'Shiffting' },
                        error: { value: 'Error' },
                    }
                }),
            },
            technicians: { type: new GraphQLList(GraphQLString) },
            slot: { type: GraphQLString },
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

            return await Team.findByIdAndUpdate(
                args.id,
                {
                    $set: {
                        name: args.name,
                        category: args.category,
                        technicians: args.technicians,
                        slot: args.slot,
                    }
                },
                { new: true },
            );
        }
    }
}

module.exports = TeamMutation;