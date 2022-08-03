const Client = require("../../database/models/Client");

const ClientType = require("../types/Client")

const {
    GraphQLID, 
    GraphQLList,
} = require('graphql');

const ClientQuery = {
    clients: {
        type: new GraphQLList(ClientType),
        async resolve(_parent, _args) {
            return await Client.find();
        }
    },
    client: {
        type: ClientType,
        args: { id: { type: GraphQLID } },
        async resolve(_parent, args) {
            return await Client.findById(args.id);
        }
    },
};

module.exports = {
    ClientQuery,
};
