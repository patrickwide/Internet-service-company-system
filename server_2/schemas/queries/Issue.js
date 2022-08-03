const {
    GraphQLID, 
    GraphQLList,
} = require('graphql');

const Issue = require("../../database/models/Issue");
const IssueType = require("../types/Issue")

const IssueQuery = {
    issues: {
        type: new GraphQLList(IssueType),
        async resolve(_parent, _args) {
            return await Issue.find().populate('sender');
        }
    },
    issue: {
        type: IssueType,
        args: {
            id: { type: GraphQLID }
        },
        async resolve(_parent, args) {
            return await Issue.findById(args.id).populate('sender');
        },
    },
}

module.exports = {
    IssueQuery
};