const { 
    GraphQLNonNull, 
    GraphQLString, 
    GraphQLID,
    GraphQLEnumType,
} = require("graphql");
const mongoose = require('mongoose');
const Issue = require("../../database/models/Issue");
const IssueType = require("../types/Issue");

const IssueMutation = {
    // add issue
    addIssue: {
        type: IssueType,
        args: {
            // sender: { type: new GraphQLNonNull(GraphQLString) },
            sender_on_model: { 
                type: new GraphQLEnumType({
                    name: 'addIssueSenderOnModel',
                    values: {
                        client: { value: 'Client' },
                        agent: { value: 'Agent' },
                        admin: { value: 'Admin' },
                        technician: { value: 'Technician' },
                    },
                }) 
            },
            body: { type: new GraphQLNonNull(GraphQLString) },
        },
        async resolve(_parent, args, context) {

            // A list of models(users) that are allowed for this request
            const allowedUsers = [ Admin,Agent ];

            // authenticate the user
            const authentiactedUser = await authenticateUser(allowedUsers, context);

            // if user is authenticated
            if (authentiactedUser === 1) {
                throw new Error("User is not authentiacted.");
            }

            // if authenticated user is allowed for this request
            if (authentiactedUser === 2 ) {
                throw new Error("User is not authorized for this request.");
            } 
            
            // check if sender exists

            let issue;

            const session = await mongoose.startSession();
            
            try {
                session.startTransaction();
                issue = new Issue({
                    sender: authentiactedUser.authentiactedUser._id,
                    sender_on_model: authentiactedUser.userOnModel,
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
        },
    },
    // delete issue
    deleteIssue: {
        type: IssueType,
        args: { id: { type: GraphQLID } },
        async resolve(_parent, args) {
            // check if sender exists

            let issue;

            const session = await mongoose.startSession();
            
            try {
                session.startTransaction();
                await Issue.findByIdAndRemove(args.id);
                session.commitTransaction();
            } catch (error) {
                session.abortTransaction();
                throw error;
            }
            session.endSession();
            return issue.populate('sender');
        }
    },
    // update issue
    updateIssue: {
        type: IssueType,
        args: {
            id: { type: GraphQLID }, 
            status: { 
                type: new GraphQLEnumType({
                    name: 'updateIssueStatus',
                    values: {
                        open: { value: 'Open' },
                        closed: { value: 'Closed' },
                    },
                }) 
            },
            body: { type: GraphQLString },    
        }, 
        resolve(_parent, args) {
            return Issue.findByIdAndUpdate(
                args.id,
                {
                    $set: {
                        status:args.status,
                        body:args.body
                    }
                },
                { new: true },
            ).populate('sender');
        }
    }
}

module.exports = IssueMutation;