const { GraphQLList, GraphQLID, GraphQLNonNull } = require("graphql");
const Issue = require("../../database/models/Issue");
const IssueType = require("../types/Issue");

const IssueQuery = {
    issues: {
        type: new GraphQLList(IssueType),
        resolve(_parent, _args) {
            // let issues = [];
            // try {
            //     issues = await Issue.find();
            //     // .populate("sender_id");
            //     console.log(issues);
            // } catch (error) {
            //     throw error;
            // }
            return Issue.find();
        }
    },
    // issue: {
    //     type: IssueType,
    //     args: { id: { type: new GraphQLNonNull(GraphQLID) } },
    //     async resolve(_parent, args) {
    //         let issue;
    //         try {
    //             issue = await Issue.findById(args.id).populate('sender_id');
    //             console.log(issue);
    //         } catch (error) {
    //             throw error;
    //         }
    //         return issue;
    //     }
    // }
}

module.exports = { 
    IssueQuery 
};