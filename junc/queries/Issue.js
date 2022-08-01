const Issue = require("./../../database-helpers/models/Issue");

const IssueType = require("./../types/Issue")

const {
    GraphQLID, 
    GraphQLList,
    GraphQLNonNull,
} = require('graphql');

const IssueQuery = {
    issues: {
        type: new GraphQLList(IssueType),
        async resolve(_parent, _args) {
            let issue;
            try {
                issue = await Issue.find().populate('sender_id');
            } catch(err) {
                throw err;
            }
            console.log(issue);
            return issue;
        }
    },
    issue: {
        type: IssueType,
        args: { id: { type: new GraphQLNonNull(GraphQLID) } },
        resolve(_parent, args) {
            return IssueType.findById(args.id);
        }
    },
};

module.exports = {
    IssueQuery,
};
