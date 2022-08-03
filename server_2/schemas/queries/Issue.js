const {
    GraphQLID, 
    GraphQLList,
} = require('graphql');

const Issue = require("../../database/models/Issue");
const IssueType = require("../types/Issue")

const IssueQuery = {
    issues: {
        type: new GraphQLList(IssueType),
        resolve(_parent, _args) {
            return Issue.find();
        }
    },
    issue: {
        type: IssueType,
        args: {
            id: { type: GraphQLID }
        },
        resolve(_parent, args) {
            return Issue.findById(args.id);
        },
    },
}

module.exports = {
    IssueQuery
};