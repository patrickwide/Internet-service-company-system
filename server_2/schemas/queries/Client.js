const Client = require("../../database/models/Client");

const ClientType = require("../types/Client")

const {
    GraphQLID, 
    GraphQLList,
} = require('graphql');

const ClientQuery = {
    clients: {
        type: new GraphQLList(ClientType),
        resolve(_parent, _args) {
            return Client.find();
        }
    },
    client: {
        type: ClientType,
        args: { id: { type: GraphQLID } },
        resolve(_parent, args) {
            return Client.findById(args.id);
        }
    },
};

module.exports = {
    ClientQuery,
};
