const { GraphQLEnumType, GraphQLNonNull, GraphQLInputObjectType, GraphQLID, GraphQLString } = require("graphql");
const { default: mongoose } = require("mongoose");
const Issue = require("../../database/models/Issue");
const IssueType = require("../types/Issue");
const senderModelEnum = new GraphQLEnumType({
    name: 'senderModelEnum',
    values: {
        CLIENT : { value: 'Client' },
        AGENT : { value: 'Agent' },
        TECHNICIAN : { value: 'Technician' },
        ADMIN : { value: 'Admin' },
    }
});

const IssueMutation = {
    addIssue: {
        type: IssueType,
        args: {
            sender_id: { type: new GraphQLNonNull(GraphQLID) },
            issue_body: { type: GraphQLString },                
        },
        async resolve(_parent, args) {
            const issue =  new Issue({
                sender_id: args.sender_id,
                issue_body: args.issue_body,                    
            });

            return issue.save();
        }
    }
}

module.exports = IssueMutation;