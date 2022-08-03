const { 
    GraphQLNonNull, 
    GraphQLString, 
    GraphQLID 
} = require("graphql");

const Issue = require("../../database/models/Issue");
const IssueType = require("../types/Issue");
const Client = require("../../database/models/Client");

const IssueMutation = {
    // add issue
    addIssue: {
        type: IssueType,
        args: {
            sender_id: { type: new GraphQLNonNull(GraphQLString) },
            body: { type: new GraphQLNonNull(GraphQLString) },
        },
        async resolve(_parent, args) {
            const issue = new Issue({
                sender_id: args.sender_id,
                body: args.body,
            });

            // let client_exists = Client.exists({ _id: args.sender_id });

            // if (!client_exists) {
            //     return new Error("Error: The client provided doesn't exist.");
            // } else {
            // }
            return issue.save();
        }
    }
}

module.exports = IssueMutation;