const RootQuery = require("./queries")
const RootMutation = require("./mutations");

const {
    GraphQLSchema,
} = require('graphql');

module.exports = new GraphQLSchema({
    query:RootQuery,
    mutation: RootMutation,
});
