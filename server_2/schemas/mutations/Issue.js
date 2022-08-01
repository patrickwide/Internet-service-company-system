const { GraphQLEnumType, GraphQLNonNull, GraphQLInputObjectType, GraphQLID, GraphQLString } = require("graphql");
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
            sender_model: { type: senderModelEnum },
            issue_body: { type: GraphQLString },                
        },
        async resolve(_parent, args) {
            const issue =  new Issue({
                sender_id: args.sender_id,
                sender_model: args.sender_model,
                issue_body: args.issue_body,                    
            });
            await issue.save();
            return issue;
        }
    }
}

module.exports = IssueMutation;