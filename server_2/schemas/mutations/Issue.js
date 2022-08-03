const { 
    GraphQLNonNull, 
    GraphQLString, 
    GraphQLID,
    GraphQLEnumType,
} = require("graphql");
const mongoose = require('mongoose');
const Issue = require("../../database/models/Issue");
const IssueType = require("../types/Issue");
const Client = require("../../database/models/Client");

const IssueMutation = {
    // add issue
    addIssue: {
        type: IssueType,
        args: {
            sender: { type: new GraphQLNonNull(GraphQLString) },
            sender_on_model: { 
                type: new GraphQLEnumType({
                    name: 'SenderOnModel',
                    values: {
                        client: { value: 'Client' },
                        agent: { value: 'Agent' },
                    },
                }) 
            },
            body: { type: new GraphQLNonNull(GraphQLString) },
        },
        async resolve(_parent, args) {
            // let client_exists = Client.exists({ _id: args.sender });

            // if (!client_exists) {
            //     return new Error("Error: The client provided doesn't exist.");
            // } else {
            // }

            let issue;

            const session = await mongoose.startSession();
            
            try {
                session.startTransaction();
                issue = new Issue({
                    sender: args.sender,
                    sender_on_model: args.sender_on_model,
                    body: args.body,
                });
                await issue.save();
                session.commitTransaction();
            } catch (error) {
                session.abortTransaction();
                throw error;
            }
            session.endSession();
            return issue.populate('sender');
        }
    }
}

module.exports = IssueMutation;