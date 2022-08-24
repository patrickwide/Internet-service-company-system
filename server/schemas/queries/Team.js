const Team = require("../../database/models/Team");
const TeamType = require("../types/Team");

const {
    GraphQLID, 
    GraphQLList,
} = require('graphql');

const TeamQuery = {
    Teams: {
        type: new GraphQLList(TeamType),
        async resolve(_parent, _args) {
            return  await Team.find();
        }
    },
    Team: {
        type: TeamType,
        args: { 
            id: { type: GraphQLID },
        },
        async resolve(_parent, args) {
            return await Team.findById(args.id);
        },
    },
};

module.exports = TeamQuery;