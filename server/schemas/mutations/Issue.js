const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLEnumType,
} = require("graphql");
const mongoose = require("mongoose");

// import Issue model
const Issue = require("../../database/models/Issue");
// import Issue type
const IssueType = require("../types/Issue");

// import models
const Client = require("../../database/models/Client");
const Admin = require("../../database/models/Admin");
const Agent = require("../../database/models/Agent");
const Technician = require("../../database/models/Technician");

// import auth
const authenticateUser = require("../auth/");

const IssueMutation = {
  // add issue
  addIssue: {
    type: IssueType,
    args: {
      body: { type: new GraphQLNonNull(GraphQLString) },
    },
    async resolve(_parent, args, context) {
      // [check if sender exists]

      // A list of models(users) that are allowed for this request
      const allowedUsers = [Admin, Agent, Client, Technician];

      // authenticate the user
      const authenticatedUser = await authenticateUser(allowedUsers, context);

      // if user is authenticated
      if (authenticatedUser === 1) {
        throw new Error("User is not authentiacted.");
      }

      // if authenticated user is allowed for this request
      if (authenticatedUser === 2) {
        throw new Error("User is not authorized for this request.");
      }

      let issue;

      const session = await mongoose.startSession();

      try {
        session.startTransaction();
        issue = new Issue({
          sender: authenticatedUser.authenticatedUser._id,
          sender_on_model: authenticatedUser.authenticateduserOnModel,
          body: args.body,
        });
        await issue.save();
        session.commitTransaction();
      } catch (error) {
        session.abortTransaction();
        throw error;
      }
      session.endSession();
      return await issue.populate("sender");
    },
  },
  // delete issue
  deleteIssue: {
    type: IssueType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLString) },
    },
    async resolve(_parent, args, context) {
      // [check if sender exists]

      // A list of models(users) that are allowed for this request
      const allowedUsers = [Admin, Agent, Client];

      // authenticate the user
      const authenticatedUser = await authenticateUser(allowedUsers, context);

      // if user is authenticated
      if (authenticatedUser === 1) {
        throw new Error("User is not authentiacted.");
      }

      // if authenticated user is allowed for this request
      if (authenticatedUser === 2) {
        throw new Error("User is not authorized for this request.");
      }

      // check if user did post the message
      const message = await Issue.findById(args.id);
      if (
        authenticatedUser.authenticatedUser._id.toString() !==
        message.sender.toString()
      ) {
        throw new Error("User is not authorized for this request.");
      }

      return await Issue.findByIdAndRemove(args.id).populate("sender");
    },
  },
  // update issue
  updateIssue: {
    type: IssueType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
      status: {
        type: new GraphQLEnumType({
          name: "updateIssueStatus",
          values: {
            open: { value: "Open" },
            closed: { value: "Closed" },
          },
        }),
      },
      body: { type: GraphQLString },
    },
    async resolve(_parent, args, context) {
      // [check if sender exists]

      // A list of models(users) that are allowed for this request
      const allowedUsers = [Admin, Agent, Client];

      // authenticate the user
      const authenticatedUser = await authenticateUser(allowedUsers, context);

      // if user is authenticated
      if (authenticatedUser === 1) {
        throw new Error("User is not authentiacted.");
      }

      // if authenticated user is allowed for this request
      if (authenticatedUser === 2) {
        throw new Error("User is not authorized for this request.");
      }

      // check if user did post the message
      const message = await Issue.findById(args.id);
      if (
        authenticatedUser.authenticatedUser._id.toString() !==
        message.sender.toString()
      ) {
        throw new Error("User is not authorized for this request.");
      }

      return await Issue.findByIdAndUpdate(
        args.id,
        {
          $set: {
            status: args.status,
            body: args.body,
          },
        },
        { new: true }
      ).populate("sender");
    },
  },
};

module.exports = IssueMutation;
