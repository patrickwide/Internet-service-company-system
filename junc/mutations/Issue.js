const { 
    GraphQLNonNull, 
    GraphQLString, 
    GraphQLID, 
    GraphQLEnumType
} = require("graphql");

const IssueType = require("../types/Issue");
const Issue = require("../../database-helpers/models/Issue");

const IssueMutation = {
    // add issue
    addIssue: {
        type: IssueType,
        args: {
            sender_id: {
                type: new GraphQLNonNull(GraphQLID)
            },
            sender_model : {
                type: new GraphQLEnumType({
                    name: 'AddIssueSenderType',
                    values: {
                        client: { value: 'Client' } ,
                        agent: { value:  'Agent' },
                        technician: { value: 'Technician' },
                        admin: { value: 'Admin' }
                    },
                }),
            },
            issue_body: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve(_parent,args) {
            const issue = new Issue({
                sender_id: args.sender_id,
                sender_model: args.sender_model,
                issue_body: args.issue_body,
            });
            return issue.save();
        }
    },
    // delete issue
    deleteIssue: {
        type: IssueType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve(_parent, args) {
            return Issue.findByIdAndDelete(args.id);
        }
    },
    // update issue
    updateIssue: {
        type: IssueType,
        id: { type: new GraphQLNonNull(GraphQLID) },
        args: {
            sender_id: {
                type: GraphQLID
            },
            status: {
                type: new GraphQLEnumType({
                    name: 'UpdateIssueStatus',
                    values: {
                        open: { value: 'Open' },
                        closed: { value: 'Closed' },
                    },
                }),
            },
            issue_body: { type: GraphQLString },
        },
        resolve(_parent, args) {
            return Issue.findByIdAndUpdate(
                args.id,
                {
                    $set: {
                        sender_id: args.sender_id,
                        status: args.status,
                        issue_body: args.issue_body,                                
                    }
                },
                { new: false },
            );
        },
    },
};

module.exports = IssueMutation;