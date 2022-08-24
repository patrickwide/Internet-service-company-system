const {
    GraphQLID, 
    GraphQLList,
} = require('graphql');

const IssueModel = require("../../database/models/Issue");
const IssueType = require("../types/Issue")

const IssueQuery = {
    issues: {
        type: new GraphQLList(IssueType),
        async resolve(_parent, _args) {
            return await IssueModel.find().populate('sender');
        }
    },
    issue: {
        type: IssueType,
        args: {
            id: { type: GraphQLID }
        },
        async resolve(_parent, args) {
            return await IssueModel.findById(args.id).populate('sender');
        },
    },
}

module.exports = IssueQuery;